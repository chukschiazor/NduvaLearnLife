import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, CheckCircle, TrendingUp, BookOpen } from "lucide-react";
import type { Course } from "@shared/schema";

type AnalyticsData = {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgress: number;
};

export default function CourseAnalytics() {
  const { courseId } = useParams();

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: [`/api/courses/${courseId}/analytics`],
    enabled: !!courseId,
  });

  const isLoading = courseLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course || !analytics) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Analytics not available</p>
        </div>
        <Footer />
      </div>
    );
  }

  const completionRate = analytics.totalEnrollments > 0 
    ? Math.round((analytics.completedEnrollments / analytics.totalEnrollments) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <Link href="/my-courses">
            <Button variant="ghost" className="gap-2 mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to My Courses
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-course-title">
            {course.title}
          </h1>
          <p className="text-muted-foreground">Course Analytics & Performance</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Enrollments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-enrollments">
                {analytics.totalEnrollments}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All students enrolled
              </p>
            </CardContent>
          </Card>

          {/* Active Enrollments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-active-enrollments">
                {analytics.activeEnrollments}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently learning
              </p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-completed-enrollments">
                {analytics.completedEnrollments}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          {/* Average Progress */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-average-progress">
                {analytics.averageProgress}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all students
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Active Students</span>
                  <span className="font-medium">{analytics.activeEnrollments} / {analytics.totalEnrollments}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ 
                      width: `${analytics.totalEnrollments > 0 ? (analytics.activeEnrollments / analytics.totalEnrollments) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 rounded-full h-2 transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Average Progress</span>
                  <span className="font-medium">{analytics.averageProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-chart-3 rounded-full h-2 transition-all"
                    style={{ width: `${analytics.averageProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1">{course.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Age Group</p>
                  <p className="font-medium mt-1">{course.ageGroup}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-medium mt-1 capitalize">{course.difficulty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium mt-1 capitalize">{course.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State Message */}
        {analytics.totalEnrollments === 0 && (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">No Enrollments Yet</h3>
              <p className="text-muted-foreground">
                This course hasn't received any enrollments yet. Share it with students to get started!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
