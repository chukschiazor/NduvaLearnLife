import { Button } from "@/components/ui/button";
import { login } from "@/hooks/useAuth";
import { Sparkles, Trophy, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            NDUVA
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            An adaptive, gamified learning platform that grows with you
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={login}
              className="text-lg px-8"
              data-testid="button-login"
            >
              Start Learning
            </Button>
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
