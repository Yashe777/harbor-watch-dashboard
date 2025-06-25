
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
    // Fetch initial notifications using direct query since the table might not be in types yet
    const fetchNotifications = async () => {
      try {
        // Try to fetch from notifications table directly
        const response = await fetch(`https://vidswyunnkwmxgzrhrbt.supabase.co/rest/v1/notifications?order=created_at.desc`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZHN3eXVubmt3bXhnenJocmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTQ5MTcsImV4cCI6MjA2NjE3MDkxN30.T4JOF28i8pEMxnMYG07dzVJBR9-sYpFdO6va6F4gDD8',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZHN3eXVubmt3bXhnenJocmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTQ5MTcsImV4cCI6MjA2NjE3MDkxN30.T4JOF28i8pEMxnMYG07dzVJBR9-sYpFdO6va6F4gDD8',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data || []);
          console.log('Loaded notifications:', data?.length || 0);
        } else {
          console.error('Error fetching notifications: table may not exist yet');
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
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
      // Use direct API call since notifications table might not be in types
      const response = await fetch(`https://vidswyunnkwmxgzrhrbt.supabase.co/rest/v1/notifications?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZHN3eXVubmt3bXhnenJocmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTQ5MTcsImV4cCI6MjA2NjE3MDkxN30.T4JOF28i8pEMxnMYG07dzVJBR9-sYpFdO6va6F4gDD8',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZHN3eXVubmt3bXhnenJocmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1OTQ5MTcsImV4cCI6MjA2NjE3MDkxN30.T4JOF28i8pEMxnMYG07dzVJBR9-sYpFdO6va6F4gDD8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
        );
      } else {
        console.error('Error marking notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return { notifications, loading, markAsRead };
};
