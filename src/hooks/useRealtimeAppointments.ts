
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Using a more flexible type that works with the current database
interface Appointment {
  id: number;
  created_at: string;
  appointment_date: string | null;
  appointment_time: string | null;
  patient_name?: string | null;
  name: string | null;
  phone: string | null;
  patient_phone?: string | null;
  service: string | null;
  appointment_type?: string | null;
  reason?: string | null;
  status: string | null;
  priority?: string | null;
  location: string | null;
  notes: string | null;
}

export const useRealtimeAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial appointments
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching appointments:', error);
          toast({
            title: "Error",
            description: "Failed to load appointments",
            variant: "destructive",
          });
        } else {
          console.log('Loaded appointments:', data?.length || 0);
          setAppointments(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Subscribe to real-time changes with proper channel naming
    const channel = supabase
      .channel('appointments-realtime-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('New appointment received via realtime:', payload.new);
          const newAppointment = payload.new as Appointment;
          
          setAppointments(prev => [newAppointment, ...prev]);
          
          toast({
            title: "New Appointment",
            description: `New appointment with ${newAppointment.name || 'Unknown'} scheduled`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment updated via realtime:', payload.new);
          const updatedAppointment = payload.new as Appointment;
          
          setAppointments(prev => 
            prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
          );
          
          toast({
            title: "Appointment Updated",
            description: `Appointment with ${updatedAppointment.name || 'Unknown'} updated`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment deleted via realtime:', payload.old);
          const deletedAppointment = payload.old as Appointment;
          
          setAppointments(prev => 
            prev.filter(apt => apt.id !== deletedAppointment.id)
          );
          
          toast({
            title: "Appointment Cancelled",
            description: `Appointment cancelled`,
          });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to appointments realtime updates');
        }
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { appointments, loading };
};
