import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Leaf } from "lucide-react";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Students_learning_hero_image_af5a6f00.png";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="absolute top-20 right-20 opacity-10">
        <Leaf className="h-64 w-64 text-secondary rotate-12" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <Leaf className="h-48 w-48 text-primary -rotate-45" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Master Life Skills Through{" "}
                <span className="text-primary">Interactive Learning</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Join thousands of students aged 10-23 learning essential life skills through engaging animated videos, interactive quizzes, and real-world projects.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="gap-2" 
                onClick={() => setLocation("/onboarding")}
                data-testid="button-get-started"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-background/60 backdrop-blur" data-testid="button-watch-demo">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">5,000+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-chart-2">50+</div>
                <div className="text-sm text-muted-foreground">Video Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-chart-3">95%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none" />
            <img
              src={heroImage}
              alt="Students learning together"
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
