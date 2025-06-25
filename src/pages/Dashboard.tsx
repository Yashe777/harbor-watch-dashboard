import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  Phone, 
  FileText, 
  MessageSquare,
  Settings,
  LogOut,
  Activity,
  MapPin,
  Stethoscope,
  Users,
  Filter
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "appointment" | "emergency" | "lab" | "message";
  title: string;
  message: string;
  time: string;
  priority: "high" | "medium" | "low";
  read: boolean;
}

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: "ER" | "General" | "Teleconsultation";
  reason: string;
  status: "scheduled" | "in-progress" | "completed";
  priority: "urgent" | "normal" | "routine";
}

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  allergies: string[];
  lastVisit: string;
  files: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Initial empty state - will be populated from Supabase
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients] = useState<Patient[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState("list");

  useEffect(() => {
    const auth = localStorage.getItem("doctorAuth");
    if (!auth) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(auth));

    // TODO: Replace with Supabase real-time subscriptions
    // This will listen for real notifications and appointments from the client app
    console.log("Dashboard ready for real-time data from client app:", "harhour-aid-mobile-65.lovable.app");
    
    // Removed fake notification generation - will be replaced with real Supabase subscriptions
    
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("doctorAuth");
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been securely logged out.",
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
    // TODO: Update read status in Supabase
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Harhour Emergency</h1>
              <p className="text-sm text-gray-500">Medical Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Stats Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {appointments.filter(a => a.priority === "urgent").length} urgent, {appointments.filter(a => a.priority === "routine").length} routine
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Emergencies</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {notifications.filter(n => n.type === "emergency" && !n.read).length}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.type === "message" && !n.read).length}
                </div>
                <p className="text-xs text-muted-foreground">From client app</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => n.type === "lab" && !n.read).length}
                </div>
                <p className="text-xs text-muted-foreground">Ready for review</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Today's Schedule</CardTitle>
                      <CardDescription>Appointments from client app: harhour-aid-mobile-65.lovable.app</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentView(currentView === "list" ? "calendar" : "list")}>
                        {currentView === "list" ? <Calendar className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No appointments yet</p>
                      <p className="text-sm">Waiting for appointments from client app</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{appointment.time}</div>
                              <Badge variant={appointment.priority === "urgent" ? "destructive" : "secondary"}>
                                {appointment.priority}
                              </Badge>
                            </div>
                            <div>
                              <h3 className="font-semibold">{appointment.patientName}</h3>
                              <p className="text-sm text-gray-600">{appointment.reason}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{appointment.type}</Badge>
                                <span className="text-xs text-gray-500">{appointment.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <User className="h-4 w-4 mr-2" />
                              View Patient
                            </Button>
                            {appointment.type === "Teleconsultation" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Phone className="h-4 w-4 mr-2" />
                                Join Call
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Notifications</CardTitle>
                  <CardDescription>Live alerts from client app</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No notifications yet</p>
                        <p className="text-sm">Waiting for real-time alerts from client app</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              !notification.read ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-full ${
                                  notification.type === "emergency" ? "bg-red-100 text-red-600" :
                                  notification.type === "appointment" ? "bg-blue-100 text-blue-600" :
                                  notification.type === "lab" ? "bg-green-100 text-green-600" :
                                  "bg-purple-100 text-purple-600"
                                }`}>
                                  {notification.type === "emergency" && <AlertTriangle className="h-4 w-4" />}
                                  {notification.type === "appointment" && <Calendar className="h-4 w-4" />}
                                  {notification.type === "lab" && <FileText className="h-4 w-4" />}
                                  {notification.type === "message" && <MessageSquare className="h-4 w-4" />}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{notification.title}</h4>
                                  <p className="text-sm text-gray-600">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                </div>
                              </div>
                              <Badge variant={
                                notification.priority === "high" ? "destructive" :
                                notification.priority === "medium" ? "default" : "secondary"
                              }>
                                {notification.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Summaries</CardTitle>
                  <CardDescription>Patient information from appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {patients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No patient data yet</p>
                      <p className="text-sm">Patient summaries will appear when appointments are created</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {patients.map((patient) => (
                        <div
                          key={patient.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {patient.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold">{patient.name}</h3>
                                <p className="text-sm text-gray-600">Age: {patient.age} • {patient.condition}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-gray-500">Last visit: {patient.lastVisit}</span>
                                  {patient.allergies.length > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      Allergies: {patient.allergies.join(', ')}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-2" />
                                Files ({patient.files})
                              </Button>
                              <Button variant="outline" size="sm">
                                <Activity className="h-4 w-4 mr-2" />
                                History
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Internal Messages</CardTitle>
                  <CardDescription>Communication with client app and emergency dispatch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No messages yet</p>
                    <p className="text-sm">Internal communication will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
