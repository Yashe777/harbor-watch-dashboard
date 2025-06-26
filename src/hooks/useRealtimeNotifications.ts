
import { useState, useEffect } from "react";
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

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    type: "emergency",
    title: "Emergency Alert",
    message: "New emergency patient in Room 1",
    priority: "high",
    read: false,
    appointment_id: 3,
    doctor_id: "dr-siham"
  },
  {
    id: "2",
    created_at: new Date(Date.now() - 300000).toISOString(),
    type: "appointment",
    title: "New Appointment",
    message: "Sarah Johnson scheduled for teleconsultation",
    priority: "medium",
    read: false,
    appointment_id: 2,
    doctor_id: "dr-siham"
  },
  {
    id: "3",
    created_at: new Date(Date.now() - 600000).toISOString(),
    type: "lab",
    title: "Lab Results Ready",
    message: "Blood test results for John Smith are ready",
    priority: "medium",
    read: true,
    appointment_id: 1,
    doctor_id: "dr-siham"
  }
];

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
    
    toast({
      title: "Notification",
      description: "Marked as read",
    });
  };

  return { notifications, loading, markAsRead };
};
