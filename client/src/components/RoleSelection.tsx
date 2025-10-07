import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, User } from "lucide-react";
import Logo from "./Logo";

interface RoleSelectionProps {
  onSelectRole: (role: "learner" | "teacher") => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <Logo size="lg" className="mx-auto mb-6" />
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">
            Choose Your Journey
          </h1>
          <p className="text-lg text-muted-foreground">
            Select your role to get started with personalized learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="group hover-elevate cursor-pointer border-2 transition-all duration-300 hover:border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full -ml-12 -mb-12" />
            
            <CardContent className="p-8 text-center relative" onClick={() => onSelectRole("learner")}>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">Learner</h3>
              <p className="text-muted-foreground mb-6">
                Start your learning journey and master essential life skills at your own pace
              </p>
              <Button className="w-full gap-2" data-testid="button-select-learner">
                Continue as Learner
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover-elevate cursor-pointer border-2 transition-all duration-300 hover:border-secondary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full -ml-12 -mb-12" />
            
            <CardContent className="p-8 text-center relative" onClick={() => onSelectRole("teacher")}>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-3">Teacher</h3>
              <p className="text-muted-foreground mb-6">
                Create and manage courses, track student progress, and inspire learners
              </p>
              <Button variant="secondary" className="w-full gap-2" data-testid="button-select-teacher">
                Continue as Teacher
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
