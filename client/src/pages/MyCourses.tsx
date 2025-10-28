import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Users, BookOpen, BarChart3, Eye, EyeOff, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Course } from "@shared/schema";

export default function MyCourses() {
  const { toast } = useToast();
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [courseToUnpublish, setCourseToUnpublish] = useState<Course | null>(null);

  // Fetch courses created by the teacher (including drafts)
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/teacher/courses'],
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const res = await apiRequest("DELETE", `/api/courses/${courseId}`);
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/teacher/courses'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({ title: "Course deleted successfully!" });
      setCourseToDelete(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete course", 
        description: error.message || "An error occurred",
        variant: "destructive" 
      });
      setCourseToDelete(null);
    },
  });

  // Toggle course status mutation
  const toggleCourseStatusMutation = useMutation({
    mutationFn: async ({ courseId, status }: { courseId: string; status: 'draft' | 'published' }) => {
      const res = await apiRequest("PATCH", `/api/courses/${courseId}/status`, { status });
      return res.json();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/teacher/courses'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({ title: `Course ${data.status === 'published' ? 'published' : 'unpublished'} successfully!` });
      setCourseToUnpublish(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update course status", 
        description: error.message || "An error occurred",
        variant: "destructive" 
      });
      setCourseToUnpublish(null);
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Courses</h1>
              <p className="text-muted-foreground">Manage and edit your published courses</p>
            </div>
            <Link href="/admin" data-testid="link-create-course">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Course
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first course to start teaching on NDUVA
                </p>
                <Link href="/admin">
                  <Button data-testid="button-create-first-course">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <Card key={course.id} className="hover-elevate" data-testid={`card-course-${index}`}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.ageGroup}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="capitalize">{course.difficulty}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {course.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2">
                    <Link href={`/course-builder/${course.id}`} data-testid={`link-edit-course-${index}`} className="flex-1 min-w-[120px]">
                      <Button className="w-full gap-2" variant="outline">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/analytics/${course.id}`} data-testid={`link-analytics-${index}`} className="flex-1 min-w-[120px]">
                      <Button className="w-full gap-2" variant="outline">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </Button>
                    </Link>
                    <Button
                      className="flex-1 min-w-[120px] gap-2"
                      variant="outline"
                      onClick={() => {
                        if (course.status === 'published') {
                          setCourseToUnpublish(course);
                        } else {
                          toggleCourseStatusMutation.mutate({ courseId: course.id, status: 'published' });
                        }
                      }}
                      disabled={toggleCourseStatusMutation.isPending}
                      data-testid={`button-toggle-status-${index}`}
                    >
                      {course.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {course.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      className="gap-2"
                      variant="outline"
                      onClick={() => setCourseToDelete(course)}
                      disabled={deleteCourseMutation.isPending}
                      data-testid={`button-delete-course-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
              All modules, sessions, quizzes, and projects associated with this course will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => courseToDelete && deleteCourseMutation.mutate(courseToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unpublish Confirmation Dialog */}
      <AlertDialog open={!!courseToUnpublish} onOpenChange={() => setCourseToUnpublish(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unpublish "{courseToUnpublish?.title}"? 
              This will remove it from the Explore Courses page and make it unavailable to learners.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => courseToUnpublish && toggleCourseStatusMutation.mutate({ 
                courseId: courseToUnpublish.id, 
                status: 'draft' 
              })}
            >
              Unpublish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
