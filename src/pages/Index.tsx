
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Stethoscope, Phone, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "", code: "" });
  const [showTwoFA, setShowTwoFA] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.email && credentials.password) {
      setShowTwoFA(true);
      toast({
        title: "2FA Code Sent",
        description: "Please check your authenticator app for the verification code.",
      });
    }
  };

  const handleTwoFA = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.code) {
      // Simulate authentication
      localStorage.setItem("doctorAuth", JSON.stringify({
        email: credentials.email,
        role: "doctor",
        name: "Dr. Sarah Johnson",
        authenticated: true
      }));
      navigate("/dashboard");
      toast({
        title: "Login Successful",
        description: "Welcome back, Dr. Johnson",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Harhour Emergency</h1>
          <p className="text-gray-600">Medical Staff Portal</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {showTwoFA ? "Two-Factor Authentication" : "Secure Login"}
            </CardTitle>
            <CardDescription className="text-center">
              {showTwoFA ? "Enter your 6-digit verification code" : "Access your medical dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showTwoFA ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@harhouremergency.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Shield className="mr-2 h-4 w-4" />
                  Continue to 2FA
                </Button>
              </form>
            ) : (
              <form onSubmit={handleTwoFA} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={credentials.code}
                    onChange={(e) => setCredentials({...credentials, code: e.target.value})}
                    className="text-center text-2xl tracking-widest"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <Shield className="mr-2 h-4 w-4" />
                  Verify & Login
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowTwoFA(false)}
                >
                  Back to Login
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              Emergency: 911
            </div>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              IT Support: ext. 5555
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
