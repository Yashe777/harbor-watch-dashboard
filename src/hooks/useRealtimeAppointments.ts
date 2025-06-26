
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Mock appointment data structure
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

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: 1,
    created_at: new Date().toISOString(),
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: "09:00",
    name: "John Smith",
    patient_name: "John Smith",
    phone: "+1234567890",
    patient_phone: "+1234567890",
    service: "General Consultation",
    appointment_type: "In-person",
    reason: "Regular checkup",
    status: "scheduled",
    priority: "normal",
    location: "Room 101",
    notes: "First visit"
  },
  {
    id: 2,
    created_at: new Date().toISOString(),
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: "10:30",
    name: "Sarah Johnson",
    patient_name: "Sarah Johnson",
    phone: "+1234567891",
    patient_phone: "+1234567891",
    service: "Teleconsultation",
    appointment_type: "Teleconsultation",
    reason: "Follow-up consultation",
    status: "scheduled",
    priority: "urgent",
    location: "Virtual",
    notes: "Previous surgery follow-up"
  },
  {
    id: 3,
    created_at: new Date().toISOString(),
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: "14:00",
    name: "Michael Brown",
    patient_name: "Michael Brown",
    phone: "+1234567892",
    patient_phone: "+1234567892",
    service: "Emergency",
    appointment_type: "Emergency",
    reason: "Chest pain",
    status: "in-progress",
    priority: "urgent",
    location: "Emergency Room",
    notes: "Urgent case"
  }
];

export const useRealtimeAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
      
      toast({
        title: "Dashboard Connected",
        description: "Using mock appointment data",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { appointments, loading };
};
