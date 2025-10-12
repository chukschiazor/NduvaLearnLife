import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { User, GraduationCap } from "lucide-react";

export default function Onboarding() {
  const { completeProfile, isCompletingProfile } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState<"learner" | "teacher">("learner");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dateOfBirth) {
      toast({
        title: "Date of birth required",
        description: "Please enter your date of birth to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      await completeProfile({ role, dateOfBirth });
      toast({
        title: "Profile completed!",
        description: `Welcome to NDUVA as a ${role}!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to NDUVA!</CardTitle>
          <CardDescription className="text-base">
            Let's set up your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">I am a...</Label>
              <RadioGroup value={role} onValueChange={(value) => setRole(value as "learner" | "teacher")}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate active-elevate-2 cursor-pointer">
                  <RadioGroupItem value="learner" id="learner" data-testid="radio-learner" />
                  <Label htmlFor="learner" className="flex items-center gap-3 cursor-pointer flex-1">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Learner</div>
                      <div className="text-sm text-muted-foreground">I want to learn new skills</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate active-elevate-2 cursor-pointer">
                  <RadioGroupItem value="teacher" id="teacher" data-testid="radio-teacher" />
                  <Label htmlFor="teacher" className="flex items-center gap-3 cursor-pointer flex-1">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">Teacher</div>
                      <div className="text-sm text-muted-foreground">I want to create and share courses</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
                data-testid="input-dateOfBirth"
              />
              <p className="text-xs text-muted-foreground">
                We use this to provide age-appropriate content
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isCompletingProfile}
              data-testid="button-complete-profile"
            >
              {isCompletingProfile ? "Setting up..." : "Get Started"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
