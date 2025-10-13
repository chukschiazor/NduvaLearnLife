import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Nova } from "@/components/Nova";
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative Background Elements (Smart Club Style) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Right Decorative Sphere */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        {/* Bottom Left Decorative Sphere */}
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-success/5 rounded-full blur-2xl" />
        {/* Decorative Leaves */}
        <div className="absolute top-1/4 left-10 opacity-5">
          <Nova size="lg" variant="navy" />
        </div>
        <div className="absolute bottom-1/4 right-20 opacity-5">
          <Nova size="md" variant="circle" />
        </div>
        {/* Dot Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Main Card (Smart Club Inspired) */}
      <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl p-8 md:p-12 border border-card-border">
        {/* Nova Mascot Circle */}
        <div className="flex justify-center mb-6">
          <Nova size="xl" variant="circle" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
            Welcome to NDUVA!
          </h1>
          <p className="text-base text-muted-foreground">
            Let's personalize your learning journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">I am a...</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(value) => setRole(value as "learner" | "teacher")}
              className="space-y-3"
            >
              <div className="relative">
                <RadioGroupItem 
                  value="learner" 
                  id="learner" 
                  className="peer sr-only" 
                  data-testid="radio-learner" 
                />
                <Label 
                  htmlFor="learner" 
                  className="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
                >
                  <div className="p-2 rounded-xl bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">Learner</div>
                    <div className="text-sm text-muted-foreground">I want to learn new skills</div>
                  </div>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem 
                  value="teacher" 
                  id="teacher" 
                  className="peer sr-only" 
                  data-testid="radio-teacher" 
                />
                <Label 
                  htmlFor="teacher" 
                  className="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
                >
                  <div className="p-2 rounded-xl bg-primary/10">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base">Teacher</div>
                    <div className="text-sm text-muted-foreground">I want to create and share courses</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-base font-medium">
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="rounded-xl h-12 text-base"
              data-testid="input-dateOfBirth"
            />
            <p className="text-xs text-muted-foreground">
              We use this to provide age-appropriate content
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg"
            className="w-full rounded-xl text-lg h-12 shadow-md hover:shadow-lg transition-shadow" 
            disabled={isCompletingProfile}
            data-testid="button-complete-profile"
          >
            {isCompletingProfile ? "Setting up your journey..." : "Get Started"}
          </Button>
        </form>

        {/* Progress Dots (like Smart Club) */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="w-2 h-2 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
