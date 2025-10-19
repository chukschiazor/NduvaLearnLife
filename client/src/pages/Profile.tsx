import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  Award,
  Settings,
  Target,
  Star,
  TrendingUp,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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

                  {/* Edit Profile Button */}
                  <Button variant="outline" size="sm" className="gap-2 w-full" data-testid="button-edit-profile">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Button>

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

              {/* Learning Time / Streak Chart */}
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="font-display text-lg">Learning Time & Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Streak display */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Streak</span>
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="font-bold text-lg">{currentStreak} days</span>
                      </div>
                    </div>
                    
                    {/* Weekly activity bar chart */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Weekly Activity</p>
                      <div className="flex items-end justify-between gap-1 h-24">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                          // Generate deterministic activity based on current streak
                          // Show activity for the last N days matching the streak length
                          const daysSinceStart = 6 - idx; // Sunday is most recent (0), Monday is 6 days ago
                          const hasActivity = currentStreak > daysSinceStart;
                          const activity = hasActivity ? 80 + (idx * 2) : 0; // Gradient pattern for active days
                          
                          return (
                            <div key={day} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full bg-muted rounded-sm overflow-hidden flex flex-col justify-end" style={{ height: '80px' }}>
                                <div 
                                  className="bg-primary transition-all"
                                  style={{ height: `${activity}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{day.substring(0, 1)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Achievement Badges */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="font-display text-xl">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { 
                      title: "First Quiz Master", 
                      description: "Complete first quiz with 100%", 
                      icon: Trophy, 
                      isUnlocked: completedCourses >= 1, 
                      unlockedDate: "2 days ago" 
                    },
                    { 
                      title: "Week Warrior", 
                      description: "7-day learning streak", 
                      icon: Zap, 
                      isUnlocked: currentStreak >= 7, 
                      unlockedDate: "1 week ago" 
                    },
                    { 
                      title: "Course Completer", 
                      description: "Finish your first course", 
                      icon: Award, 
                      isUnlocked: completedCourses >= 1, 
                      unlockedDate: "2 weeks ago" 
                    },
                    { 
                      title: "Perfect Score", 
                      description: "Get 100% on 5 quizzes", 
                      icon: Star, 
                      isUnlocked: false 
                    },
                    { 
                      title: "Community Helper", 
                      description: "Help 10 students in forum", 
                      icon: Target, 
                      isUnlocked: false 
                    },
                    { 
                      title: "All-Rounder", 
                      description: "Complete all course modules", 
                      icon: TrendingUp, 
                      isUnlocked: false 
                    },
                  ].map((achievement) => (
                    <div 
                      key={achievement.title}
                      className={`p-4 rounded-lg border ${
                        achievement.isUnlocked 
                          ? 'border-primary/20 bg-primary/5' 
                          : 'border-muted-foreground/20 bg-muted/30'
                      }`}
                      data-testid={`achievement-${achievement.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          p-2 rounded-full
                          ${achievement.isUnlocked 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          <achievement.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                          {achievement.isUnlocked && achievement.unlockedDate && (
                            <p className="text-xs text-primary mt-1">Unlocked {achievement.unlockedDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Latest Certificate */}
            <Card className="bg-card/80 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="font-display text-xl">Latest Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                {completedCourses > 0 ? (
                  <div className="space-y-4">
                    {/* Certificate Preview */}
                    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-lg p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Certificate of Completion</p>
                      <h3 className="font-display font-bold text-2xl mb-4" data-testid="certificate-student-name">
                        {displayName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">Has successfully completed the course</p>
                      <h4 className="font-display font-bold text-xl text-primary mb-4" data-testid="certificate-course-name">
                        Unlocking Creativity
                      </h4>
                      <p className="text-xs text-muted-foreground">Completed on January 15, 2025</p>
                      <p className="text-xs text-muted-foreground mt-2">NDUVA Learning Platform</p>
                    </div>
                    
                    {/* Download Button */}
                    <Button className="w-full gap-2" size="lg" data-testid="button-download-certificate">
                      <Download className="h-5 w-5" />
                      Download Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No certificates yet</p>
                    <p className="text-sm mt-1">Complete a course to earn your first certificate!</p>
                  </div>
                )}
              </CardContent>
            </Card>

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

      <Footer />
    </div>
  );
}
