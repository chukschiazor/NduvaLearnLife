import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Courses from "@/pages/Courses";
import Classroom from "@/pages/Classroom";
import Admin from "@/pages/Admin";
import Leaderboard from "@/pages/Leaderboard";
import Forum from "@/pages/Forum";
import Profile from "@/pages/Profile";
import LessonView from "@/pages/LessonView";
import NotFound from "@/pages/not-found";

function Router() {
  // DEVELOPMENT MODE: Authentication bypassed - all pages accessible
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
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
