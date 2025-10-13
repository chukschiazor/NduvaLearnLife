import Navbar from "@/components/Navbar";
import HexagonalAvatar from "@/components/HexagonalAvatar";
import CircularBadge from "@/components/CircularBadge";
import { Nova } from "@/components/Nova";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Leaf, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Circle,
  BarChart3,
  Award
} from "lucide-react";

type Enrollment = {
  id: string;
  courseId: string;
  progressPercentage: number;
  completedLessons: number;
  status: string;
  course: {
    title: string;
    totalLessons: number;
    difficulty: string;
  };
};

export default function Profile() {
  const { user } = useAuth();
  const displayName = user?.firstName || 'Learner';
  const userInitials = user?.firstName?.[0] || 'L';
  const xpPoints = user?.xpPoints || 0;
  const currentStreak = user?.currentStreak || 0;

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ['/api/enrollments/me'],
    enabled: !!user,
  });

  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const ongoingCourses = enrollments.filter(e => e.status === 'active').length;

  // Calculate average progress
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / enrollments.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[320px,1fr] gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/10">
              <CardContent className="pt-6 pb-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Smart Platform Logo */}
                  <div className="w-full flex justify-center mb-2">
                    <Nova variant="circle" className="w-12 h-12" />
                  </div>

                  {/* Hexagonal Profile Photo */}
                  <HexagonalAvatar 
                    src={user?.profileImageUrl}
                    fallback={userInitials}
                    size="lg"
                  />

                  {/* User Name */}
                  <div>
                    <h2 className="font-display font-bold text-2xl" data-testid="text-profile-name">
                      {displayName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1" data-testid="text-profile-email">
                      {user?.email || 'learner@nduva.com'}
                    </p>
                  </div>

                  {/* Achievement Badges */}
                  <div className="flex gap-4 pt-4">
                    <CircularBadge 
                      icon={Leaf} 
                      label="Starter" 
                      isActive={xpPoints >= 100}
                    />
                    <CircularBadge 
                      icon={Trophy} 
                      label="Winner" 
                      isActive={completedCourses >= 1}
                    />
                    <CircularBadge 
                      icon={Zap} 
                      label="Streak" 
                      isActive={currentStreak >= 3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Components/Navigation Card */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="font-display text-lg">Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid="nav-enrollment-overview">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <span className="text-sm">Enrollment Overview</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid="nav-good-day">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">2</span>
                  </div>
                  <span className="text-sm">Good Day Resources</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid="nav-packkitcom">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                  <span className="text-sm">PackKit.com</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover-elevate cursor-pointer" data-testid="nav-braindesigns">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">4</span>
                  </div>
                  <span className="text-sm">BrainDesigns</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Area */}
          <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display font-bold text-3xl text-foreground" data-testid="heading-dashboard-step">
                  Dashboard Step
                </h1>
                <p className="text-muted-foreground mt-1">A Smart Club Learning Platform MVP</p>
              </div>
              <Badge variant="outline" className="gap-2 border-primary/20" data-testid="badge-track-id">
                <BarChart3 className="h-4 w-4" />
                Track ID
              </Badge>
            </div>

            {/* Progress Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ongoing/Done Status */}
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Nova variant="default" className="w-6 h-6" />
                    Progress Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Circle className="h-5 w-5 text-chart-2" />
                      <span className="text-sm">Ongoing</span>
                    </div>
                    <span className="font-bold text-chart-2" data-testid="stat-ongoing-courses">{ongoingCourses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-sm">Done/Completed</span>
                    </div>
                    <span className="font-bold text-primary" data-testid="stat-completed-courses">{completedCourses}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-semibold">{avgProgress}%</span>
                    </div>
                    <Progress value={avgProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Badges Display */}
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Achievement Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { icon: Leaf, active: xpPoints >= 100 },
                      { icon: Leaf, active: currentStreak >= 3 },
                      { icon: Leaf, active: completedCourses >= 1 },
                      { icon: Leaf, active: avgProgress >= 50 },
                    ].map((badge, idx) => (
                      <div
                        key={idx}
                        className={`
                          aspect-square rounded-full flex items-center justify-center
                          ${badge.active 
                            ? 'bg-primary/10 border-2 border-primary' 
                            : 'bg-muted border-2 border-muted-foreground/20'
                          }
                        `}
                        data-testid={`achievement-badge-${idx}`}
                      >
                        <badge.icon className={`h-6 w-6 ${badge.active ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Completion Stages - Course Progress */}
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="font-display text-xl">Completion Stages</CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No courses enrolled yet</p>
                    <p className="text-sm mt-1">Start a course to track your progress!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {enrollments.map((enrollment, idx) => (
                      <div key={enrollment.id} className="space-y-2" data-testid={`course-progress-${idx}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                              D{idx + 1}A
                            </Badge>
                            <h4 className="font-semibold">{enrollment.course.title}</h4>
                          </div>
                          <Badge variant={enrollment.status === 'completed' ? 'default' : 'secondary'}>
                            {enrollment.status === 'completed' ? 'Done' : 'Ongoing'}
                          </Badge>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{enrollment.completedLessons} / {enrollment.course.totalLessons} Lessons</span>
                            <span>{enrollment.progressPercentage}%</span>
                          </div>
                          <Progress value={enrollment.progressPercentage} className="h-2" />
                        </div>

                        {/* Module Breakdown - Simulated */}
                        <div className="grid grid-cols-5 gap-2 pt-2">
                          {Array.from({ length: 5 }).map((_, moduleIdx) => {
                            const moduleProgress = Math.min(
                              100,
                              Math.max(0, (enrollment.progressPercentage - moduleIdx * 20))
                            );
                            return (
                              <div key={moduleIdx} className="space-y-1">
                                <div className="h-16 bg-muted rounded-md overflow-hidden flex flex-col justify-end">
                                  <div 
                                    className="bg-primary transition-all"
                                    style={{ height: `${moduleProgress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-center text-muted-foreground">
                                  M{moduleIdx + 1}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
