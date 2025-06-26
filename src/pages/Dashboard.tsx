
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
import { useRealtimeAppointments } from "@/hooks/useRealtimeAppointments";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export default function Dashboard() {
  const navigate = useNavigate();
  const { appointments, loading: appointmentsLoading } = useRealtimeAppointments();
  const { notifications, loading: notificationsLoading, markAsRead } = useRealtimeNotifications();
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState("list");

  useEffect(() => {
    // Set mock user data instead of checking localStorage
    setUser({
      name: "Dr. Siham Harhour",
      role: "doctor",
      email: "siham.harhour@hospital.com"
    });

    console.log("Dashboard running in standalone mode with mock data");
  }, []);

  const handleLogout = () => {
    // Simple logout without Supabase
    setUser(null);
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been logged out from the dashboard.",
    });
  };

  const handleViewPatient = (appointmentId: string) => {
    navigate(`/patient/${appointmentId}`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Transform appointment data for display
  const transformedAppointments = appointments.map(apt => ({
    id: apt.id.toString(),
    patientName: apt.patient_name || apt.name || "Unknown Patient",
    time: apt.appointment_time || "Not specified",
    type: apt.appointment_type || apt.service || "General",
    reason: apt.reason || apt.notes || "No reason specified",
    status: apt.status || "scheduled",
    priority: apt.priority || "normal",
    phone: apt.patient_phone || apt.phone || "",
    location: apt.location || "Not specified"
  }));

  // Transform notification data for display
  const transformedNotifications = notifications.map(notif => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    time: new Date(notif.created_at).toLocaleTimeString(),
    priority: notif.priority,
    read: notif.read
  }));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Loading dashboard...</p>
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
            <div className="p-2 bg-blue-600 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Harhour Emergency</h1>
              <p className="text-sm text-gray-500">Medical Dashboard - Standalone Mode</p>
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
                <p className="text-sm font-medium text-gray-900">Dr. Siham Harhour</p>
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
                <div className="text-2xl font-bold">{transformedAppointments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {transformedAppointments.filter(a => a.priority === "urgent").length} urgent, {transformedAppointments.filter(a => a.priority === "normal").length} routine
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
                  {transformedNotifications.filter(n => n.type === "emergency" && !n.read).length}
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
                  {transformedNotifications.filter(n => n.type === "message" && !n.read).length}
                </div>
                <p className="text-xs text-muted-foreground">Mock data</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transformedNotifications.filter(n => n.type === "lab" && !n.read).length}
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
                      <CardTitle>Mock Appointments</CardTitle>
                      <CardDescription>Sample appointment data for demonstration</CardDescription>
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
                  {appointmentsLoading ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-spin" />
                      <p>Loading appointments...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transformedAppointments.map((appointment) => (
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
                                {appointment.phone && (
                                  <span className="text-xs text-gray-500">📞 {appointment.phone}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPatient(appointment.id)}
                            >
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
                  <CardTitle>Mock Notifications</CardTitle>
                  <CardDescription>Sample notification data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {notificationsLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-spin" />
                        <p>Loading notifications...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transformedNotifications.map((notification) => (
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
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>Mock patient data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Patient profiles from mock data</p>
                    <p className="text-sm">Click "View Patient" on appointments to see detailed information</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Internal Messages</CardTitle>
                  <CardDescription>Mock communication system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No messages in mock mode</p>
                    <p className="text-sm">This is demonstration data only</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
