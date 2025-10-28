import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import StatsCard from "@/components/StatsCard";
import { BookOpen, Target, TrendingUp, Flame, Sparkles, GraduationCap } from "lucide-react";
import budgetingImg from "@assets/generated_images/Budgeting_module_thumbnail_a94e4967.png";
import creativityImg from "@assets/generated_images/Creativity_module_thumbnail_fe82ef99.png";
import problemSolvingImg from "@assets/generated_images/Problem-solving_module_thumbnail_08a22595.png";
import investingImg from "@assets/generated_images/Investing_module_thumbnail_ebfef553.png";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EnrollmentWithCourse, Course } from "@shared/schema";

export default function Courses() {
  // Fetch user's enrollments to determine if they're a new user
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<EnrollmentWithCourse[]>({
    queryKey: ['/api/enrollments/me'],
  });

  // Fetch published courses from the API
  const { data: publishedCourses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });
  
  const stats = [
    { title: "Lessons Completed", value: 24, icon: BookOpen, description: "Keep up the great work!", trend: { value: 12, isPositive: true } },
    { title: "Quiz Average", value: "87%", icon: Target, description: "Above average", trend: { value: 5, isPositive: true } },
    { title: "Learning Streak", value: "7 days", icon: Flame, description: "Personal best!", colorClass: "text-warning" },
    { title: "Overall Progress", value: "65%", icon: TrendingUp, description: "On track", colorClass: "text-chart-3" },
  ];

  const isNewUser = !enrollmentsLoading && Array.isArray(enrollments) && enrollments.length === 0;
  const isLoading = enrollmentsLoading || coursesLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  // New user view - Explore Courses
  if (isNewUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="font-display font-bold text-4xl md:text-5xl">Explore Courses</h1>
              <GraduationCap className="h-8 w-8 text-secondary" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your learning journey! Pick a course that matches your interests and goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCourses && publishedCourses.length > 0 ? (
              publishedCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  thumbnail={course.thumbnailUrl || budgetingImg}
                  totalLessons={course.totalLessons}
                  ageGroup={course.ageGroup}
                  isExploreMode={true} 
                  data-testid={`course-card-${course.id}`}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No published courses available yet.</p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Existing user view - My Learning Dashboard
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">My Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mb-6">
          <h2 className="font-display font-bold text-2xl mb-2">My Courses</h2>
          <p className="text-muted-foreground">Continue where you left off</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {enrollments && enrollments.length > 0 ? (
            enrollments.filter(enrollment => enrollment.course).map((enrollment) => (
              <CourseCard 
                key={enrollment.id} 
                id={enrollment.course!.id}
                title={enrollment.course!.title}
                description={enrollment.course!.description}
                thumbnail={enrollment.course!.thumbnailUrl || budgetingImg}
                progress={enrollment.progressPercentage}
                totalLessons={enrollment.course!.totalLessons}
                ageGroup={enrollment.course!.ageGroup}
                data-testid={`enrolled-course-card-${enrollment.courseId}`}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Browse Courses
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
