
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  User, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Activity,
  Heart,
  Thermometer,
  Weight,
  Ruler
} from "lucide-react";

// Mock patient data based on appointment ID
const mockPatients: { [key: string]: any } = {
  "1": {
    id: 1,
    name: "John Smith",
    phone: "+1234567890",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "09:00",
    service: "General Consultation",
    reason: "Regular checkup",
    status: "scheduled",
    priority: "normal",
    location: "Room 101",
    age: 45,
    gender: "Male",
    bloodType: "O+",
    allergies: "None known",
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: "36.5",
    weight: 75,
    height: 175
  },
  "2": {
    id: 2,
    name: "Sarah Johnson",
    phone: "+1234567891",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "10:30",
    service: "Teleconsultation",
    reason: "Follow-up consultation",
    status: "scheduled",
    priority: "urgent",
    location: "Virtual",
    age: 32,
    gender: "Female",
    bloodType: "A+",
    allergies: "Penicillin",
    heartRate: 85,
    bloodPressure: "110/70",
    temperature: "37.1",
    weight: 62,
    height: 165
  },
  "3": {
    id: 3,
    name: "Michael Brown",
    phone: "+1234567892",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "14:00",
    service: "Emergency",
    reason: "Chest pain",
    status: "in-progress",
    priority: "urgent",
    location: "Emergency Room",
    age: 58,
    gender: "Male",
    bloodType: "B-",
    allergies: "Shellfish",
    heartRate: 95,
    bloodPressure: "140/90",
    temperature: "36.8",
    weight: 85,
    height: 180
  }
};

export default function PatientDetails() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (appointmentId && mockPatients[appointmentId]) {
      setPatient(mockPatients[appointmentId]);
    }
  }, [appointmentId]);

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Patient not found</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Patient Details</h1>
              <p className="text-sm text-gray-500">{patient.name} - Mock Data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={patient.priority === "urgent" ? "destructive" : "secondary"}>
              {patient.priority}
            </Badge>
            <Badge variant="outline">{patient.status}</Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold">{patient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-lg">{patient.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-lg">{patient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blood Type</label>
                    <p className="text-lg">{patient.bloodType}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-4">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{patient.phone}</span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Known Allergies</label>
                  <p className="text-lg">{patient.allergies}</p>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Current Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{patient.appointmentDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{patient.appointmentTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span>{patient.service}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{patient.location}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Reason for Visit</label>
                  <p className="text-lg">{patient.reason}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vital Signs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Vital Signs
                </CardTitle>
                <CardDescription>Mock measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <p className="text-sm text-gray-500">Heart Rate</p>
                    <p className="text-xl font-bold text-red-600">{patient.heartRate}</p>
                    <p className="text-xs text-gray-400">bpm</p>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-gray-500">Blood Pressure</p>
                    <p className="text-xl font-bold text-blue-600">{patient.bloodPressure}</p>
                    <p className="text-xs text-gray-400">mmHg</p>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="text-xl font-bold text-orange-600">{patient.temperature}°</p>
                    <p className="text-xs text-gray-400">Celsius</p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Weight className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="text-xl font-bold text-green-600">{patient.weight}</p>
                    <p className="text-xs text-gray-400">kg</p>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Ruler className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="text-xl font-bold text-purple-600">{patient.height}</p>
                  <p className="text-xs text-gray-400">cm</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="default">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Notes
                </Button>
                <Button className="w-full" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Update Vitals
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Patient
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
