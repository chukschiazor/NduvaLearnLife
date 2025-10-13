import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Video, BookOpen, Trash2, Edit } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Course, Module, CourseSession } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    ageGroup: "14-17" as "10-13" | "14-17" | "18-21",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    estimatedDurationMinutes: 60,
  });

  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    sequenceOrder: 1,
  });

  const [sessionForm, setSessionForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    durationSeconds: 0,
    sequenceOrder: 1,
  });

  // Fetch courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Fetch modules for selected course
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['/api/courses', selectedCourse?.id, 'modules'],
    enabled: !!selectedCourse,
  });

  // Fetch sessions for selected module
  const { data: sessions = [] } = useQuery<CourseSession[]>({
    queryKey: ['/api/modules', selectedModule?.id, 'sessions'],
    enabled: !!selectedModule,
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (data: typeof courseForm) => {
      const res = await apiRequest("POST", "/api/courses", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({ title: "Course created successfully!" });
      setShowCourseForm(false);
      setCourseForm({
        title: "",
        description: "",
        ageGroup: "14-17",
        difficulty: "beginner",
        estimatedDurationMinutes: 60,
      });
    },
  });

  // Create module mutation
  const createModuleMutation = useMutation({
    mutationFn: async (data: typeof moduleForm) => {
      const res = await apiRequest("POST", `/api/courses/${selectedCourse?.id}/modules`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', selectedCourse?.id, 'modules'] });
      toast({ title: "Module created successfully!" });
      setShowModuleForm(false);
      setModuleForm({ title: "", description: "", sequenceOrder: modules.length + 1 });
    },
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (data: typeof sessionForm) => {
      const res = await apiRequest("POST", `/api/modules/${selectedModule?.id}/sessions`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modules', selectedModule?.id, 'sessions'] });
      toast({ title: "Session created successfully!" });
      setShowSessionForm(false);
      setSessionForm({ title: "", description: "", videoUrl: "", durationSeconds: 0, sequenceOrder: sessions.length + 1 });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage courses, modules, and sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Column */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Courses</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowCourseForm(!showCourseForm)}
                  data-testid="button-add-course"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {showCourseForm && (
                <Card className="p-4 space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      placeholder="Course title"
                      data-testid="input-course-title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      placeholder="Course description"
                      data-testid="textarea-course-description"
                    />
                  </div>
                  <div>
                    <Label>Age Group</Label>
                    <Select
                      value={courseForm.ageGroup}
                      onValueChange={(value: any) => setCourseForm({ ...courseForm, ageGroup: value })}
                    >
                      <SelectTrigger data-testid="select-age-group">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-13">10-13</SelectItem>
                        <SelectItem value="14-17">14-17</SelectItem>
                        <SelectItem value="18-21">18-21</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select
                      value={courseForm.difficulty}
                      onValueChange={(value: any) => setCourseForm({ ...courseForm, difficulty: value })}
                    >
                      <SelectTrigger data-testid="select-difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => createCourseMutation.mutate(courseForm)}
                    disabled={createCourseMutation.isPending || !courseForm.title}
                    className="w-full"
                    data-testid="button-create-course"
                  >
                    Create Course
                  </Button>
                </Card>
              )}

              {coursesLoading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
              ) : (
                courses.map((course) => (
                  <Card
                    key={course.id}
                    className={`p-3 cursor-pointer hover-elevate ${
                      selectedCourse?.id === course.id ? "border-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedCourse(course);
                      setSelectedModule(null);
                    }}
                    data-testid={`card-course-${course.id}`}
                  >
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Modules Column */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Modules</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowModuleForm(!showModuleForm)}
                  disabled={!selectedCourse}
                  data-testid="button-add-module"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {selectedCourse && (
                <CardDescription className="text-xs">{selectedCourse.title}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {showModuleForm && selectedCourse && (
                <Card className="p-4 space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      placeholder="Module title"
                      data-testid="input-module-title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={moduleForm.description || ""}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      placeholder="Module description"
                      data-testid="textarea-module-description"
                    />
                  </div>
                  <Button
                    onClick={() => createModuleMutation.mutate(moduleForm)}
                    disabled={createModuleMutation.isPending || !moduleForm.title}
                    className="w-full"
                    data-testid="button-create-module"
                  >
                    Create Module
                  </Button>
                </Card>
              )}

              {!selectedCourse ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Select a course to view modules
                </p>
              ) : modules.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No modules yet
                </p>
              ) : (
                modules.map((module) => (
                  <Card
                    key={module.id}
                    className={`p-3 cursor-pointer hover-elevate ${
                      selectedModule?.id === module.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedModule(module)}
                    data-testid={`card-module-${module.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{module.title}</h3>
                        {module.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{module.description}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Sessions Column */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sessions</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowSessionForm(!showSessionForm)}
                  disabled={!selectedModule}
                  data-testid="button-add-session"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {selectedModule && (
                <CardDescription className="text-xs">{selectedModule.title}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {showSessionForm && selectedModule && (
                <Card className="p-4 space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={sessionForm.title}
                      onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                      placeholder="Session title"
                      data-testid="input-session-title"
                    />
                  </div>
                  <div>
                    <Label>Video URL</Label>
                    <Input
                      value={sessionForm.videoUrl || ""}
                      onChange={(e) => setSessionForm({ ...sessionForm, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      data-testid="input-session-video-url"
                    />
                  </div>
                  <div>
                    <Label>Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={sessionForm.durationSeconds || ""}
                      onChange={(e) => setSessionForm({ ...sessionForm, durationSeconds: parseInt(e.target.value) || 0 })}
                      placeholder="300"
                      data-testid="input-session-duration"
                    />
                  </div>
                  <Button
                    onClick={() => createSessionMutation.mutate(sessionForm)}
                    disabled={createSessionMutation.isPending || !sessionForm.title}
                    className="w-full"
                    data-testid="button-create-session"
                  >
                    Create Session
                  </Button>
                </Card>
              )}

              {!selectedModule ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Select a module to view sessions
                </p>
              ) : sessions.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No sessions yet
                </p>
              ) : (
                sessions.map((session) => (
                  <Card key={session.id} className="p-3" data-testid={`card-session-${session.id}`}>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{session.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor((session.durationSeconds || 0) / 60)} min
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
