import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Video, Edit, Trash2, GripVertical, BookOpen, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Course, Module, CourseSession } from "@shared/schema";
import { Link } from "wouter";

export default function CourseBuilder() {
  const { toast } = useToast();
  const [, params] = useRoute("/course-builder/:courseId");
  const courseId = params?.courseId;
  const [, navigate] = useLocation();

  // Dialog states
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // Form states
  const [sectionForm, setSectionForm] = useState({
    title: "",
    description: "",
  });

  const [lectureForm, setLectureForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    durationSeconds: 0,
  });

  // Fetch course
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId,
  });

  // Fetch sections (modules) for the course
  const { data: sections = [], isLoading: sectionsLoading } = useQuery<Module[]>({
    queryKey: ['/api/courses', courseId, 'modules'],
    enabled: !!courseId,
  });

  // Fetch all lectures (sessions) for the course
  const { data: allLectures = [] } = useQuery<CourseSession[]>({
    queryKey: ['/api/courses', courseId, 'all-sessions'],
    enabled: !!courseId,
  });

  // Group lectures by module
  const lecturesByModule = allLectures.reduce((acc, lecture) => {
    if (!acc[lecture.moduleId]) {
      acc[lecture.moduleId] = [];
    }
    acc[lecture.moduleId].push(lecture);
    return acc;
  }, {} as Record<string, CourseSession[]>);

  // Create section mutation
  const createSectionMutation = useMutation({
    mutationFn: async (data: typeof sectionForm) => {
      const res = await apiRequest("POST", `/api/courses/${courseId}/modules`, {
        ...data,
        sequenceOrder: sections.length + 1,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'modules'] });
      toast({ title: "Section created successfully!" });
      setSectionDialogOpen(false);
      setSectionForm({ title: "", description: "" });
    },
  });

  // Create lecture mutation
  const createLectureMutation = useMutation({
    mutationFn: async (data: typeof lectureForm & { moduleId: string }) => {
      const moduleLectures = lecturesByModule[data.moduleId] || [];
      const res = await apiRequest("POST", `/api/modules/${data.moduleId}/sessions`, {
        ...data,
        sequenceOrder: moduleLectures.length + 1,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-sessions'] });
      toast({ title: "Lecture created successfully!" });
      setLectureDialogOpen(false);
      setLectureForm({ title: "", description: "", videoUrl: "", durationSeconds: 0 });
      setSelectedModule(null);
    },
  });

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      await apiRequest("DELETE", `/api/modules/${moduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'modules'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-sessions'] });
      toast({ title: "Section deleted successfully!" });
    },
  });

  // Delete lecture mutation
  const deleteLectureMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await apiRequest("DELETE", `/api/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-sessions'] });
      toast({ title: "Lecture deleted successfully!" });
    },
  });

  const handleCreateSection = () => {
    if (!sectionForm.title.trim()) {
      toast({ title: "Please enter a section title", variant: "destructive" });
      return;
    }
    createSectionMutation.mutate(sectionForm);
  };

  const handleCreateLecture = () => {
    if (!lectureForm.title.trim() || !lectureForm.videoUrl.trim()) {
      toast({ title: "Please enter lecture title and video URL", variant: "destructive" });
      return;
    }
    if (!selectedModule) {
      toast({ title: "Please select a section first", variant: "destructive" });
      return;
    }
    createLectureMutation.mutate({ ...lectureForm, moduleId: selectedModule.id });
  };

  const openLectureDialog = (module: Module) => {
    setSelectedModule(module);
    setLectureDialogOpen(true);
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/my-courses" data-testid="link-back-to-courses">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to My Courses
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground">Course Curriculum</p>
          </div>

          {/* Add Section Button */}
          <div className="mb-6">
            <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-add-section">
                  <Plus className="h-4 w-4" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-add-section">
                <DialogHeader>
                  <DialogTitle>Add New Section</DialogTitle>
                  <DialogDescription>
                    Sections help organize your course content by topic or week.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      value={sectionForm.title}
                      onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                      placeholder="e.g., Week 1: Introduction to Budgeting"
                      data-testid="input-section-title"
                    />
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      value={sectionForm.description || ""}
                      onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                      placeholder="What will students learn in this section?"
                      data-testid="textarea-section-description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateSection}
                    disabled={createSectionMutation.isPending}
                    data-testid="button-create-section"
                  >
                    {createSectionMutation.isPending ? "Creating..." : "Create Section"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Curriculum - Sections and Lectures */}
          {sectionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading curriculum...</p>
            </div>
          ) : sections.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No sections yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first section to organize your course content.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4" defaultValue={sections.map(s => s.id)}>
              {sections.map((section, index) => {
                const lectures = (lecturesByModule[section.id] || []).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
                
                return (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="border rounded-lg"
                    data-testid={`section-${index}`}
                  >
                    <AccordionTrigger className="px-6 hover:no-underline hover-elevate">
                      <div className="flex items-center gap-3 flex-1">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col items-start text-left flex-1">
                          <div className="font-semibold">Section {index + 1}: {section.title}</div>
                          {section.description && (
                            <div className="text-sm text-muted-foreground">{section.description}</div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSectionMutation.mutate(section.id);
                          }}
                          data-testid={`button-delete-section-${index}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-2 mt-2">
                        {lectures.map((lecture, lectureIndex) => (
                          <div
                            key={lecture.id}
                            className="flex items-center gap-3 p-3 rounded-md border hover-elevate"
                            data-testid={`lecture-${index}-${lectureIndex}`}
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Video className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                              <div className="font-medium">{lecture.title}</div>
                              {lecture.description && (
                                <div className="text-sm text-muted-foreground">{lecture.description}</div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteLectureMutation.mutate(lecture.id)}
                              data-testid={`button-delete-lecture-${index}-${lectureIndex}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        
                        {/* Add Lecture Button */}
                        <Button
                          variant="outline"
                          className="w-full gap-2 mt-2"
                          onClick={() => openLectureDialog(section)}
                          data-testid={`button-add-lecture-${index}`}
                        >
                          <Plus className="h-4 w-4" />
                          Add Lecture
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {/* Add Lecture Dialog */}
          <Dialog open={lectureDialogOpen} onOpenChange={setLectureDialogOpen}>
            <DialogContent data-testid="dialog-add-lecture">
              <DialogHeader>
                <DialogTitle>Add New Lecture</DialogTitle>
                <DialogDescription>
                  Add a video lecture to {selectedModule?.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Lecture Title</Label>
                  <Input
                    value={lectureForm.title}
                    onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                    placeholder="e.g., Understanding Income vs Expenses"
                    data-testid="input-lecture-title"
                  />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={lectureForm.description || ""}
                    onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                    placeholder="What will students learn in this lecture?"
                    data-testid="textarea-lecture-description"
                  />
                </div>
                <div>
                  <Label>Video URL</Label>
                  <Input
                    value={lectureForm.videoUrl}
                    onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    data-testid="input-lecture-video-url"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    YouTube, Vimeo, or direct video links supported
                  </p>
                </div>
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={lectureForm.durationSeconds}
                    onChange={(e) => setLectureForm({ ...lectureForm, durationSeconds: parseInt(e.target.value) || 0 })}
                    placeholder="300"
                    data-testid="input-lecture-duration"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateLecture}
                  disabled={createLectureMutation.isPending}
                  data-testid="button-create-lecture"
                >
                  {createLectureMutation.isPending ? "Creating..." : "Create Lecture"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Footer />
    </div>
  );
}
