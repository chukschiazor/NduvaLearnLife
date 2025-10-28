import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronDown, PlayCircle, CheckCircle2, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Course, Module, CourseSession } from "@shared/schema";

export default function Classroom() {
  const { courseId } = useParams();
  const { toast } = useToast();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedSession, setSelectedSession] = useState<CourseSession | null>(null);

  // Fetch course details
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId,
  });

  // Fetch modules for the course
  const { data: modules = [], isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ['/api/courses', courseId, 'modules'],
    enabled: !!courseId,
  });

  // Fetch sessions for all modules (properly using useQueries to avoid hooks in loops)
  const sessionQueries = useQueries({
    queries: modules.map((module) => ({
      queryKey: ['/api/modules', module.id, 'sessions'],
      enabled: !!module.id,
    })),
  });

  // Combine modules with their sessions
  const modulesWithSessions = modules.map((module, index) => ({
    ...module,
    sessions: (sessionQueries[index]?.data as CourseSession[]) || [],
  }));

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const totalSessions = modulesWithSessions.reduce((acc, m) => acc + m.sessions.length, 0);
  const completedSessions = 0; // TODO: Track completed sessions
  const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  if (courseLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <p className="text-center text-muted-foreground">Loading classroom...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <p className="text-center text-muted-foreground">Course not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Course Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{completedSessions} / {totalSessions} sessions</span>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-course" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modulesWithSessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No modules available yet
                  </p>
                ) : (
                  modulesWithSessions.map((module, moduleIndex) => (
                    <div key={module.id} className="space-y-1">
                      {/* Module Header */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 hover-elevate"
                        onClick={() => toggleModule(module.id)}
                        data-testid={`button-module-${module.id}`}
                      >
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="flex-1 text-left font-semibold">
                          {moduleIndex + 1}. {module.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {module.sessions.length} sessions
                        </span>
                      </Button>

                      {/* Sessions List */}
                      {expandedModules.has(module.id) && (
                        <div className="ml-4 space-y-1">
                          {module.sessions.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-2 pl-4">
                              No sessions yet
                            </p>
                          ) : (
                            module.sessions.map((session, sessionIndex) => {
                              const isCompleted = false; // TODO: Track completion
                              const isLocked = false; // TODO: Implement prerequisites
                              const isSelected = selectedSession?.id === session.id;

                              return (
                                <Button
                                  key={session.id}
                                  variant={isSelected ? "secondary" : "ghost"}
                                  className="w-full justify-start gap-2 text-sm hover-elevate"
                                  onClick={() => setSelectedSession(session)}
                                  disabled={isLocked}
                                  data-testid={`button-session-${session.id}`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : isLocked ? (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <PlayCircle className="h-4 w-4" />
                                  )}
                                  <span className="flex-1 text-left">
                                    {moduleIndex + 1}.{sessionIndex + 1} {session.title}
                                  </span>
                                  {session.durationSeconds && (
                                    <span className="text-xs text-muted-foreground">
                                      {Math.floor(session.durationSeconds / 60)}m
                                    </span>
                                  )}
                                </Button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Video Player Area */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="space-y-4">
                <VideoPlayer
                  title={selectedSession.title}
                  videoUrl={selectedSession.videoUrl || undefined}
                  progress={0} // TODO: Track actual progress in Task 4
                  isCompleted={false} // TODO: Track completion in Task 4
                  onMarkComplete={() => {
                    toast({
                      title: "Lesson completed!",
                      description: "Great job! Keep learning.",
                    });
                  }}
                  onTimeUpdate={(currentTime, duration, percentWatched) => {
                    // TODO: Save progress to database in Task 4
                    console.log('Video progress:', { currentTime, duration, percentWatched });
                  }}
                />

                {/* Session Description */}
                {selectedSession.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About this session</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedSession.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" className="gap-2" data-testid="button-previous-session">
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Previous Session
                  </Button>
                  <Button className="gap-2" data-testid="button-next-session">
                    Next Session
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <PlayCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Select a session to begin</h3>
                  <p className="text-muted-foreground">
                    Choose a session from the course content on the left to start learning
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
