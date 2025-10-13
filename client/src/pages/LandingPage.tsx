import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Nova } from "@/components/Nova";
import { TryLessonDemo } from "@/components/TryLessonDemo";
import { login } from "@/hooks/useAuth";
import { Sparkles, Trophy, Users, Zap } from "lucide-react";

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative 3D Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Right Sphere */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        {/* Bottom Left Sphere */}
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-success/5 rounded-full blur-3xl" />
        {/* Decorative Leaf - Top Left */}
        <div className="absolute top-40 left-10 opacity-5">
          <Nova size="xl" variant="navy" />
        </div>
        {/* Decorative Leaf - Bottom Right */}
        <div className="absolute bottom-20 right-32 opacity-5">
          <Nova size="lg" variant="circle" />
        </div>
        {/* Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          {/* Nova Mascot Introduction */}
          <div className="flex justify-center">
            <Nova size="xl" variant="circle" className="animate-bounce" />
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-display text-foreground">
            NDUVA
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto font-light">
            An adaptive, gamified learning platform that <span className="text-primary font-medium">grows with you</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Button 
              size="lg" 
              onClick={() => setShowDemo(true)}
              variant="outline"
              className="text-lg px-8 rounded-xl border-2"
              data-testid="button-try-lesson"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Try a Free Lesson
            </Button>
            <Button 
              size="lg" 
              onClick={login}
              className="text-lg px-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              data-testid="button-login"
            >
              Start Learning
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • Free to start
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="AI-Powered"
            description="Personalized learning paths that adapt to your pace and style"
            color="primary"
          />
          <FeatureCard
            icon={<Trophy className="h-6 w-6" />}
            title="Gamified"
            description="Earn XP, badges, and certificates as you progress"
            color="warning"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Community"
            description="Learn together, share ideas, and grow with peers"
            color="secondary"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Interactive"
            description="Engaging video lessons, quizzes, and hands-on projects"
            color="success"
          />
        </div>

        {/* Social Proof / Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
          <StatItem number="50+" label="Courses" />
          <StatItem number="10K+" label="Learners" />
          <StatItem number="95%" label="Success Rate" />
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && <TryLessonDemo onClose={() => setShowDemo(false)} />}
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "secondary" | "success" | "warning";
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className="p-6 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-card-border hover-elevate">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg font-display">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

interface StatItemProps {
  number: string;
  label: string;
}

function StatItem({ number, label }: StatItemProps) {
  return (
    <div className="space-y-1">
      <div className="text-4xl md:text-5xl font-bold text-primary font-display">
        {number}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
