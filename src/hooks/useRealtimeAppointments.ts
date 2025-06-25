
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
          // Transform the data to match our interface
          const transformedData = (data || []).map(item => ({
            ...item,
            patient_name: (item as any).patient_name || null,
            patient_phone: (item as any).patient_phone || null,
            appointment_type: (item as any).appointment_type || null,
            reason: (item as any).reason || null,
            priority: (item as any).priority || null,
          }));
          setAppointments(transformedData);
          console.log('Loaded appointments:', transformedData.length);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('appointments-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('New appointment received:', payload.new);
          const newAppointment = {
            ...payload.new,
            patient_name: (payload.new as any).patient_name || null,
            patient_phone: (payload.new as any).patient_phone || null,
            appointment_type: (payload.new as any).appointment_type || null,
            reason: (payload.new as any).reason || null,
            priority: (payload.new as any).priority || null,
          } as Appointment;
          
          setAppointments(prev => [newAppointment, ...prev]);
          
          toast({
            title: "New Appointment",
            description: `New appointment with ${newAppointment.patient_name || newAppointment.name || 'Unknown'} scheduled`,
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
          console.log('Appointment updated:', payload.new);
          const updatedAppointment = {
            ...payload.new,
            patient_name: (payload.new as any).patient_name || null,
            patient_phone: (payload.new as any).patient_phone || null,
            appointment_type: (payload.new as any).appointment_type || null,
            reason: (payload.new as any).reason || null,
            priority: (payload.new as any).priority || null,
          } as Appointment;
          
          setAppointments(prev => 
            prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { appointments, loading };
};
