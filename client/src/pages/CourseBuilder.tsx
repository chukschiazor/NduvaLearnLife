import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Video, Trash2, GripVertical, BookOpen, ArrowLeft, FileQuestion, Briefcase, ListChecks } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Course, Module, CourseSession, Quiz, QuizQuestion, Project } from "@shared/schema";
import { Link } from "wouter";

export default function CourseBuilder() {
  const { toast } = useToast();
  const [, params] = useRoute("/course-builder/:courseId");
  const courseId = params?.courseId;
  const [, navigate] = useLocation();

  // Dialog states
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

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

  const [quizForm, setQuizForm] = useState({
    title: "",
    passingScorePercentage: 70,
    timeLimitMinutes: 0,
    shuffleQuestions: false,
    maxAttempts: 3,
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    instructions: "",
    deliverables: [] as string[],
    deliverableInput: "",
    estimatedDurationMinutes: 0,
  });

  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    questionType: "multiple_choice" as "multiple_choice" | "true_false" | "short_answer",
    correctAnswer: null as any,
    explanation: "",
    points: 10,
    answerOptions: [] as { text: string; isCorrect: boolean }[],
    answerOptionInput: "",
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

  // Fetch all quizzes for the course
  const { data: allQuizzes = [] } = useQuery<Quiz[]>({
    queryKey: ['/api/courses', courseId, 'all-quizzes', sections.map(s => s.id).join(',')],
    enabled: !!courseId && sections.length > 0,
    queryFn: async () => {
      const quizzesPromises = sections.map(module => 
        fetch(`/api/modules/${module.id}/quizzes`).then(r => r.json())
      );
      const quizzesArrays = await Promise.all(quizzesPromises);
      return quizzesArrays.flat();
    },
  });

  // Fetch all projects for the course
  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ['/api/courses', courseId, 'all-projects', sections.map(s => s.id).join(',')],
    enabled: !!courseId && sections.length > 0,
    queryFn: async () => {
      const projectsPromises = sections.map(module => 
        fetch(`/api/modules/${module.id}/projects`).then(r => r.json())
      );
      const projectsArrays = await Promise.all(projectsPromises);
      return projectsArrays.flat();
    },
  });

  // Fetch quiz questions for selected quiz
  const { data: quizQuestions = [] } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/quizzes', selectedQuiz?.id, 'questions'],
    enabled: !!selectedQuiz?.id,
  });

  // Group lectures by module
  const lecturesByModule = allLectures.reduce((acc, lecture) => {
    if (!acc[lecture.moduleId]) {
      acc[lecture.moduleId] = [];
    }
    acc[lecture.moduleId].push(lecture);
    return acc;
  }, {} as Record<string, CourseSession[]>);

  // Group quizzes by module
  const quizzesByModule = allQuizzes.reduce((acc, quiz) => {
    if (!acc[quiz.moduleId]) {
      acc[quiz.moduleId] = [];
    }
    acc[quiz.moduleId].push(quiz);
    return acc;
  }, {} as Record<string, Quiz[]>);

  // Group projects by module
  const projectsByModule = allProjects.reduce((acc, project) => {
    if (!acc[project.moduleId]) {
      acc[project.moduleId] = [];
    }
    acc[project.moduleId].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

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

  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async (data: typeof quizForm & { moduleId: string }) => {
      const res = await apiRequest("POST", `/api/modules/${data.moduleId}/quizzes`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-quizzes'], refetchType: 'all' });
      toast({ title: "Quiz created successfully!" });
      setQuizDialogOpen(false);
      setQuizForm({ title: "", passingScorePercentage: 70, timeLimitMinutes: 0, shuffleQuestions: false, maxAttempts: 3 });
      setSelectedModule(null);
    },
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: Omit<typeof projectForm, 'deliverableInput'> & { moduleId: string }) => {
      const res = await apiRequest("POST", `/api/modules/${data.moduleId}/projects`, {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        deliverables: data.deliverables,
        estimatedDurationMinutes: data.estimatedDurationMinutes || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-projects'], refetchType: 'all' });
      toast({ title: "Project created successfully!" });
      setProjectDialogOpen(false);
      setProjectForm({ title: "", description: "", instructions: "", deliverables: [], deliverableInput: "", estimatedDurationMinutes: 0 });
      setSelectedModule(null);
    },
  });

  // Create quiz question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", `/api/quizzes/${selectedQuiz?.id}/questions`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quizzes', selectedQuiz?.id, 'questions'] });
      toast({ title: "Question added successfully!" });
      setQuestionDialogOpen(false);
      setQuestionForm({
        questionText: "",
        questionType: "multiple_choice",
        correctAnswer: null,
        explanation: "",
        points: 10,
        answerOptions: [],
        answerOptionInput: "",
      });
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
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-quizzes'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-projects'], refetchType: 'all' });
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

  // Delete quiz mutation
  const deleteQuizMutation = useMutation({
    mutationFn: async (quizId: string) => {
      await apiRequest("DELETE", `/api/quizzes/${quizId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-quizzes'], refetchType: 'all' });
      toast({ title: "Quiz deleted successfully!" });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses', courseId, 'all-projects'], refetchType: 'all' });
      toast({ title: "Project deleted successfully!" });
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

  const handleCreateQuiz = () => {
    if (!quizForm.title.trim()) {
      toast({ title: "Please enter a quiz title", variant: "destructive" });
      return;
    }
    if (!selectedModule) {
      toast({ title: "Please select a section first", variant: "destructive" });
      return;
    }
    createQuizMutation.mutate({ ...quizForm, moduleId: selectedModule.id });
  };

  const handleCreateProject = () => {
    if (!projectForm.title.trim() || !projectForm.description.trim() || !projectForm.instructions.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!selectedModule) {
      toast({ title: "Please select a section first", variant: "destructive" });
      return;
    }
    createProjectMutation.mutate({ ...projectForm, moduleId: selectedModule.id });
  };

  const handleCreateQuestion = () => {
    if (!questionForm.questionText.trim()) {
      toast({ title: "Please enter a question", variant: "destructive" });
      return;
    }

    let correctAnswer: any;

    if (questionForm.questionType === "multiple_choice") {
      if (questionForm.answerOptions.length < 2) {
        toast({ title: "Please add at least 2 answer options", variant: "destructive" });
        return;
      }
      const correctIndexes = questionForm.answerOptions
        .map((opt, idx) => opt.isCorrect ? idx : -1)
        .filter(idx => idx !== -1);
      
      if (correctIndexes.length === 0) {
        toast({ title: "Please mark at least one correct answer", variant: "destructive" });
        return;
      }
      correctAnswer = correctIndexes;
    } else if (questionForm.questionType === "true_false") {
      if (questionForm.correctAnswer === null) {
        toast({ title: "Please select the correct answer", variant: "destructive" });
        return;
      }
      correctAnswer = questionForm.correctAnswer;
    } else if (questionForm.questionType === "short_answer") {
      if (!questionForm.correctAnswer || questionForm.correctAnswer.trim() === "") {
        toast({ title: "Please enter the correct answer", variant: "destructive" });
        return;
      }
      correctAnswer = questionForm.correctAnswer;
    }

    const questionData = {
      questionText: questionForm.questionText,
      questionType: questionForm.questionType,
      correctAnswer,
      explanation: questionForm.explanation || null,
      points: questionForm.points,
      sequenceOrder: quizQuestions.length + 1,
    };

    createQuestionMutation.mutate(questionData);
  };

  const openLectureDialog = (module: Module) => {
    setSelectedModule(module);
    setLectureDialogOpen(true);
  };

  const openQuizDialog = (module: Module) => {
    setSelectedModule(module);
    setQuizDialogOpen(true);
  };

  const openProjectDialog = (module: Module) => {
    setSelectedModule(module);
    setProjectDialogOpen(true);
  };

  const openQuestionDialog = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuestionDialogOpen(true);
  };

  const addDeliverable = () => {
    if (projectForm.deliverableInput.trim()) {
      setProjectForm({
        ...projectForm,
        deliverables: [...projectForm.deliverables, projectForm.deliverableInput.trim()],
        deliverableInput: "",
      });
    }
  };

  const removeDeliverable = (index: number) => {
    setProjectForm({
      ...projectForm,
      deliverables: projectForm.deliverables.filter((_, i) => i !== index),
    });
  };

  const addAnswerOption = () => {
    if (questionForm.answerOptionInput.trim()) {
      setQuestionForm({
        ...questionForm,
        answerOptions: [...questionForm.answerOptions, { text: questionForm.answerOptionInput.trim(), isCorrect: false }],
        answerOptionInput: "",
      });
    }
  };

  const removeAnswerOption = (index: number) => {
    setQuestionForm({
      ...questionForm,
      answerOptions: questionForm.answerOptions.filter((_, i) => i !== index),
    });
  };

  const toggleAnswerCorrect = (index: number) => {
    setQuestionForm({
      ...questionForm,
      answerOptions: questionForm.answerOptions.map((opt, i) => 
        i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
      ),
    });
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

          {/* Curriculum - Sections, Lectures, Quizzes, and Projects */}
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
                const quizzes = quizzesByModule[section.id] || [];
                const projects = projectsByModule[section.id] || [];
                
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
                            {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"} · {quizzes.length} {quizzes.length === 1 ? "quiz" : "quizzes"} · {projects.length} {projects.length === 1 ? "project" : "projects"}
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
                        {/* Lectures */}
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

                        {/* Quizzes */}
                        {quizzes.map((quiz, quizIndex) => (
                          <div key={quiz.id} className="space-y-2">
                            <div
                              className="flex items-center gap-3 p-3 rounded-md border hover-elevate"
                              data-testid={`quiz-${index}-${quizIndex}`}
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <FileQuestion className="h-4 w-4 text-primary" />
                              <div className="flex-1">
                                <div className="font-medium">{quiz.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  Passing: {quiz.passingScorePercentage}% · Max Attempts: {quiz.maxAttempts}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => openQuestionDialog(quiz)}
                                data-testid={`button-add-questions-${index}-${quizIndex}`}
                              >
                                <ListChecks className="h-4 w-4" />
                                Add Questions
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteQuizMutation.mutate(quiz.id)}
                                data-testid={`button-delete-quiz-${index}-${quizIndex}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {/* Add Quiz Button */}
                        <Button
                          variant="outline"
                          className="w-full gap-2 mt-2"
                          onClick={() => openQuizDialog(section)}
                          data-testid={`button-add-quiz-${index}`}
                        >
                          <Plus className="h-4 w-4" />
                          Add Quiz
                        </Button>

                        {/* Projects */}
                        {projects.map((project, projectIndex) => (
                          <div
                            key={project.id}
                            className="flex items-center gap-3 p-3 rounded-md border hover-elevate"
                            data-testid={`project-${index}-${projectIndex}`}
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Briefcase className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm text-muted-foreground">{project.description}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteProjectMutation.mutate(project.id)}
                              data-testid={`button-delete-project-${index}-${projectIndex}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}

                        {/* Add Project Button */}
                        <Button
                          variant="outline"
                          className="w-full gap-2 mt-2"
                          onClick={() => openProjectDialog(section)}
                          data-testid={`button-add-project-${index}`}
                        >
                          <Plus className="h-4 w-4" />
                          Add Project
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

          {/* Add Quiz Dialog */}
          <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
            <DialogContent data-testid="dialog-add-quiz">
              <DialogHeader>
                <DialogTitle>Add New Quiz</DialogTitle>
                <DialogDescription>
                  Add a quiz to {selectedModule?.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Quiz Title</Label>
                  <Input
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    placeholder="e.g., Budgeting Basics Assessment"
                    data-testid="input-quiz-title"
                  />
                </div>
                <div>
                  <Label>Passing Score Percentage</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={quizForm.passingScorePercentage}
                    onChange={(e) => setQuizForm({ ...quizForm, passingScorePercentage: parseInt(e.target.value) || 70 })}
                    data-testid="input-quiz-passing-score"
                  />
                </div>
                <div>
                  <Label>Time Limit (minutes, optional)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={quizForm.timeLimitMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: parseInt(e.target.value) || 0 })}
                    placeholder="0 for no limit"
                    data-testid="input-quiz-time-limit"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shuffle-questions"
                    checked={quizForm.shuffleQuestions}
                    onCheckedChange={(checked) => setQuizForm({ ...quizForm, shuffleQuestions: checked as boolean })}
                    data-testid="checkbox-shuffle-questions"
                  />
                  <Label htmlFor="shuffle-questions" className="cursor-pointer">Shuffle Questions</Label>
                </div>
                <div>
                  <Label>Max Attempts</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quizForm.maxAttempts}
                    onChange={(e) => setQuizForm({ ...quizForm, maxAttempts: parseInt(e.target.value) || 3 })}
                    data-testid="input-quiz-max-attempts"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateQuiz}
                  disabled={createQuizMutation.isPending}
                  data-testid="button-create-quiz"
                >
                  {createQuizMutation.isPending ? "Creating..." : "Create Quiz"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Project Dialog */}
          <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
            <DialogContent data-testid="dialog-add-project" className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Add a project to {selectedModule?.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Project Title</Label>
                  <Input
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g., Create a Personal Budget"
                    data-testid="input-project-title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Describe what students will build..."
                    data-testid="textarea-project-description"
                  />
                </div>
                <div>
                  <Label>Instructions</Label>
                  <Textarea
                    value={projectForm.instructions}
                    onChange={(e) => setProjectForm({ ...projectForm, instructions: e.target.value })}
                    placeholder="Step-by-step instructions for completing the project..."
                    rows={4}
                    data-testid="textarea-project-instructions"
                  />
                </div>
                <div>
                  <Label>Deliverables</Label>
                  <div className="space-y-2">
                    {projectForm.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={deliverable} disabled className="flex-1" data-testid={`text-deliverable-${index}`} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDeliverable(index)}
                          data-testid={`button-remove-deliverable-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={projectForm.deliverableInput}
                        onChange={(e) => setProjectForm({ ...projectForm, deliverableInput: e.target.value })}
                        placeholder="Add a deliverable item..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addDeliverable();
                          }
                        }}
                        data-testid="input-deliverable"
                      />
                      <Button onClick={addDeliverable} data-testid="button-add-deliverable">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Estimated Duration (minutes, optional)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={projectForm.estimatedDurationMinutes}
                    onChange={(e) => setProjectForm({ ...projectForm, estimatedDurationMinutes: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 120"
                    data-testid="input-project-duration"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                  data-testid="button-create-project"
                >
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Question Dialog */}
          <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
            <DialogContent data-testid="dialog-add-question" className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Quiz Question</DialogTitle>
                <DialogDescription>
                  Add a question to {selectedQuiz?.title}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Question Text</Label>
                  <Textarea
                    value={questionForm.questionText}
                    onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                    placeholder="Enter your question..."
                    data-testid="textarea-question-text"
                  />
                </div>
                <div>
                  <Label>Question Type</Label>
                  <Select
                    value={questionForm.questionType}
                    onValueChange={(value: any) => setQuestionForm({ ...questionForm, questionType: value, correctAnswer: null, answerOptions: [] })}
                  >
                    <SelectTrigger data-testid="select-question-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Multiple Choice Options */}
                {questionForm.questionType === "multiple_choice" && (
                  <div>
                    <Label>Answer Options</Label>
                    <div className="space-y-2">
                      {questionForm.answerOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox
                            checked={option.isCorrect}
                            onCheckedChange={() => toggleAnswerCorrect(index)}
                            data-testid={`checkbox-answer-correct-${index}`}
                          />
                          <Input value={option.text} disabled className="flex-1" data-testid={`text-answer-option-${index}`} />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAnswerOption(index)}
                            data-testid={`button-remove-answer-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={questionForm.answerOptionInput}
                          onChange={(e) => setQuestionForm({ ...questionForm, answerOptionInput: e.target.value })}
                          placeholder="Add an answer option..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addAnswerOption();
                            }
                          }}
                          data-testid="input-answer-option"
                        />
                        <Button onClick={addAnswerOption} data-testid="button-add-answer-option">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* True/False */}
                {questionForm.questionType === "true_false" && (
                  <div>
                    <Label>Correct Answer</Label>
                    <Select
                      value={questionForm.correctAnswer === null ? "" : questionForm.correctAnswer.toString()}
                      onValueChange={(value) => setQuestionForm({ ...questionForm, correctAnswer: value === "true" })}
                    >
                      <SelectTrigger data-testid="select-true-false">
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Short Answer */}
                {questionForm.questionType === "short_answer" && (
                  <div>
                    <Label>Correct Answer</Label>
                    <Input
                      value={questionForm.correctAnswer || ""}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                      placeholder="Enter the correct answer..."
                      data-testid="input-short-answer"
                    />
                  </div>
                )}

                <div>
                  <Label>Explanation (Optional)</Label>
                  <Textarea
                    value={questionForm.explanation}
                    onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                    placeholder="Explain why this is the correct answer..."
                    data-testid="textarea-explanation"
                  />
                </div>
                <div>
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) || 10 })}
                    data-testid="input-question-points"
                  />
                </div>

                {/* Display existing questions count */}
                {quizQuestions.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    This quiz currently has {quizQuestions.length} {quizQuestions.length === 1 ? "question" : "questions"}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateQuestion}
                  disabled={createQuestionMutation.isPending}
                  data-testid="button-create-question"
                >
                  {createQuestionMutation.isPending ? "Adding..." : "Add Question"}
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
