import { Button } from "@/components/ui/button";
import { login } from "@/hooks/useAuth";
import { Sparkles, Trophy, Users, Zap } from "lucide-react";
import heroImage from "@assets/generated_images/Students_learning_hero_image_af5a6f00.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-teal-500" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span className="font-semibold text-lg">Nduva</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={login}
              data-testid="button-sign-in"
            >
              Sign In
            </Button>
            <Button 
              onClick={login}
              className="bg-teal-500 hover:bg-teal-600 text-white"
              data-testid="button-sign-up"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Master Life Skills Through{" "}
              <span className="text-teal-500">Interactive Learning</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Join thousands of students aged 10-23 learning essential life skills 
              through engaging animated videos, interactive quizzes, and real-world projects.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button 
                size="lg" 
                onClick={login}
                className="bg-teal-500 hover:bg-teal-600 text-white text-lg px-8"
                data-testid="button-get-started"
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8"
                data-testid="button-watch-demo"
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold text-teal-500">5,000+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-500">50+</div>
                <div className="text-sm text-muted-foreground">Video Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-500">95%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-3xl p-8">
              <img 
                src={heroImage} 
                alt="Students learning together" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <Sparkles className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold text-lg">AI-Powered</h3>
            </div>
            <p className="text-muted-foreground">
              Personalized learning paths that adapt to your pace and style
            </p>
          </div>

          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                <Trophy className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg">Gamified</h3>
            </div>
            <p className="text-muted-foreground">
              Earn XP, badges, and certificates as you progress
            </p>
          </div>

          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg">Community</h3>
            </div>
            <p className="text-muted-foreground">
              Learn together, share ideas, and grow with peers
            </p>
          </div>

          <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg">Interactive</h3>
            </div>
            <p className="text-muted-foreground">
              Engaging video lessons, quizzes, and hands-on projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
