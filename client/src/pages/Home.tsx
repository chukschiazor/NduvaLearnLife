import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Nova } from "@/components/Nova";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Target,
  ArrowRight 
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  ageGroup: string;
  difficulty: string;
  estimatedDurationMinutes: number;
  learningObjectives: string[];
  totalLessons: number;
}

export default function Home() {
  const { user } = useAuth();
  
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Nova Welcome */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-success/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 opacity-3">
            <Nova size="xl" variant="navy" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex items-start gap-6 mb-8">
            <Nova size="xl" variant="circle" />
            <div className="flex-1">
              <h1 
                className="font-display font-bold text-3xl md:text-4xl mb-2"
                data-testid="heading-welcome"
              >
                Welcome back, {user?.firstName || 'Learner'}!
              </h1>
              <p 
                className="text-lg text-muted-foreground"
                data-testid="text-welcome-message"
              >
                Ready to continue your learning journey? Let's grow together! 
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-6 border-card-border">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-xp-points">{user?.xpPoints || 0}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-current-streak">{user?.currentStreak || 0} days</div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-card-border">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold" data-testid="stat-completed-courses">0</div>
                  <div className="text-sm text-muted-foreground">Courses Completed</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 
              className="font-display font-bold text-2xl md:text-3xl mb-2"
              data-testid="heading-explore-courses"
            >
              Explore Courses
            </h2>
            <p 
              className="text-muted-foreground"
              data-testid="text-courses-subtitle"
            >
              Choose from our collection of life skills courses
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="overflow-hidden border-card-border hover-elevate transition-all group cursor-pointer"
                data-testid={`course-card-${course.id}`}
              >
                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    data-testid={`course-thumbnail-${course.id}`}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge 
                      className={`${getDifficultyColor(course.difficulty)} border`}
                      data-testid={`course-difficulty-${course.id}`}
                    >
                      {course.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 
                      className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors"
                      data-testid={`course-title-${course.id}`}
                    >
                      {course.title}
                    </h3>
                    <p 
                      className="text-sm text-muted-foreground line-clamp-2"
                      data-testid={`course-description-${course.id}`}
                    >
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span data-testid={`course-lessons-${course.id}`}>
                        {course.totalLessons} lessons
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span data-testid={`course-duration-${course.id}`}>
                        {Math.floor(course.estimatedDurationMinutes / 60)}h {course.estimatedDurationMinutes % 60}m
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full rounded-xl gap-2" 
                    size="sm"
                    data-testid={`button-enroll-${course.id}`}
                  >
                    Start Learning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed" data-testid="empty-state-courses">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2" data-testid="heading-no-courses">
              No courses available yet
            </h3>
            <p className="text-muted-foreground" data-testid="text-no-courses">
              Check back soon for new learning opportunities!
            </p>
          </Card>
        )}
      </section>

      {/* Quick Actions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-3xl p-8 md:p-12 relative overflow-hidden border border-primary/10">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-success/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            <h2 
              className="font-display font-bold text-2xl md:text-3xl"
              data-testid="heading-level-up"
            >
              Ready to Level Up Your Skills?
            </h2>
            <p 
              className="text-lg text-muted-foreground"
              data-testid="text-level-up"
            >
              Join thousands of learners mastering essential life skills. Track your progress, earn XP, and unlock achievements!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                size="lg" 
                className="rounded-xl gap-2 shadow-lg"
                data-testid="button-explore-courses"
              >
                Explore All Courses
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl gap-2"
                data-testid="button-view-leaderboard"
              >
                <Trophy className="h-5 w-5" />
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
