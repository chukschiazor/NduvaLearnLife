import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Clock, Award } from "lucide-react";
import { Link } from "wouter";
import type { Course, Enrollment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function MyLearning() {
  const { user } = useAuth();
  
  // Fetch user's enrolled courses with progress
  const { data: enrolledCoursesData = [], isLoading: enrollmentsLoading } = useQuery<Array<{ course: Course; enrollment: Enrollment }>>({
    queryKey: ['/api/enrollments/me'],
  });

  // Fetch all published courses for recommendations
  const { data: allCourses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Get enrolled course IDs
  const enrolledCourseIds = new Set(enrolledCoursesData.map(({ course }) => course.id));
  
  // Get recommended courses (not enrolled, published only)
  const recommendedCourses = allCourses
    .filter(course => !enrolledCourseIds.has(course.id) && course.status === 'published')
    .slice(0, 3);

  const isLoading = enrollmentsLoading || coursesLoading;

  // Get user initials for avatar fallback
  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Avatar (Udemy-style) */}
        <div className="mb-8 flex items-center gap-4">
          <Avatar className="h-16 w-16" data-testid="avatar-user">
            <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || 'User'} />
            <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1" data-testid="text-welcome-message">
              Welcome back, {user?.firstName || 'Learner'}!
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey
            </p>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">My Courses</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : enrolledCoursesData.length === 0 ? (
            <Card className="border-dashed" data-testid="card-empty-state">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">You have no courses yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Start your learning journey by enrolling in a course below
                </p>
                <Link href="/courses">
                  <Button data-testid="button-browse-courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCoursesData.map(({ course, enrollment }) => {
                const progress = enrollment.progressPercentage || 0;
                
                return (
                  <Link key={course.id} href={`/classroom/${course.id}`}>
                    <Card 
                      className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all"
                      data-testid={`card-enrolled-course-${course.id}`}
                    >
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.ageGroup}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            <span className="capitalize">{course.difficulty}</span>
                          </div>
                        </div>

                        <Button className="w-full" data-testid={`button-continue-${course.id}`}>
                          {progress > 0 ? 'Continue Learning' : 'Start Course'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recommended Courses Section */}
        {recommendedCourses.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">You may like these courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <Card 
                    className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all"
                    data-testid={`card-recommended-course-${course.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.ageGroup}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span className="capitalize">{course.difficulty}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" data-testid={`button-view-${course.id}`}>
                        View Course
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
