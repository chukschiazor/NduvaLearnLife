import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import LandingPage from "@/pages/LandingPage";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Courses from "@/pages/Courses";
import Classroom from "@/pages/Classroom";
import Admin from "@/pages/Admin";
import TeacherLanding from "@/pages/TeacherLanding";
import Leaderboard from "@/pages/Leaderboard";
import Forum from "@/pages/Forum";
import Profile from "@/pages/Profile";
import LessonView from "@/pages/LessonView";
import NotFound from "@/pages/not-found";

function Router() {
  const { isLoading, isAuthenticated, needsOnboarding } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show marketing landing page for unauthenticated users
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Show onboarding for new users
  if (needsOnboarding) {
    return <Onboarding />;
  }

  // Show app for authenticated users
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/teach" component={TeacherLanding} />
      <Route path="/courses" component={Courses} />
      <Route path="/classroom/:courseId" component={Classroom} />
      <Route path="/admin" component={Admin} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/forum" component={Forum} />
      <Route path="/profile" component={Profile} />
      <Route path="/lesson/:id" component={LessonView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
