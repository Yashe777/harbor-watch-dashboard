
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  created_at: string;
  type: "appointment" | "emergency" | "lab" | "message";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  read: boolean;
  appointment_id: number | null;
  doctor_id: string | null;
}

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
          toast({
            title: "Error",
            description: "Failed to load notifications",
            variant: "destructive",
          });
        } else {
          setNotifications(data || []);
          console.log('Loaded notifications:', data?.length || 0);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('New notification received:', payload.new);
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast for new notifications
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.priority === "high" ? "destructive" : "default",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Notification updated:', payload.new);
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(notif => notif.id === updatedNotification.id ? updatedNotification : notif)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
      } else {
        setNotifications(prev => 
          prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return { notifications, loading, markAsRead };
};
