import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import QuizCard from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import creativityImg from "@assets/generated_images/Creativity_module_thumbnail_fe82ef99.png";

export default function LessonView() {
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const quizQuestions = [
    {
      question: "What is the first step in the creative problem-solving process?",
      options: [
        "Implement the solution immediately",
        "Define and understand the problem",
        "Generate as many ideas as possible",
        "Evaluate the results"
      ],
      correctAnswer: 1
    },
    {
      question: "Which technique encourages generating ideas without judgment?",
      options: [
        "Critical analysis",
        "Brainstorming",
        "Cost-benefit analysis",
        "Risk assessment"
      ],
      correctAnswer: 1
    },
  ];

  const relatedLessons = [
    { id: 1, title: "Introduction to Creative Thinking", duration: "12:30", completed: true },
    { id: 2, title: "Brainstorming Techniques", duration: "15:20", completed: true },
    { id: 3, title: "Mind Mapping Basics", duration: "10:45", completed: false },
    { id: 4, title: "Design Thinking Process", duration: "18:00", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="gap-2 mb-6" data-testid="button-back-to-course">
          <ChevronLeft className="h-4 w-4" />
          Back to Course
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!showQuiz ? (
              <>
                <VideoPlayer
                  title="Introduction to Creative Thinking"
                  thumbnail={creativityImg}
                  duration="12:30"
                  progress={95}
                  onMarkComplete={() => {
                    console.log('Video completed');
                    setShowQuiz(true);
                  }}
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Lesson Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      In this lesson, you'll learn the fundamentals of creative thinking and how to apply it to solve real-world problems. We'll explore various techniques and strategies that successful innovators use.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">What you'll learn:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>The creative thinking process</li>
                        <li>How to overcome mental blocks</li>
                        <li>Techniques for generating innovative ideas</li>
                        <li>Applying creativity to everyday situations</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <QuizCard
                question={quizQuestions[currentQuizQuestion]}
                questionNumber={currentQuizQuestion + 1}
                totalQuestions={quizQuestions.length}
                onNext={() => {
                  if (currentQuizQuestion < quizQuestions.length - 1) {
                    setCurrentQuizQuestion(currentQuizQuestion + 1);
                  } else {
                    console.log('Quiz completed');
                  }
                }}
              />
            )}

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" className="gap-2" data-testid="button-previous-lesson">
                <ChevronLeft className="h-4 w-4" />
                Previous Lesson
              </Button>
              <Button className="gap-2" data-testid="button-next-lesson">
                Next Lesson
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {relatedLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className="w-full text-left p-3 rounded-lg hover-elevate flex items-start gap-3"
                    data-testid={`button-lesson-${lesson.id}`}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${lesson.completed ? 'text-muted-foreground' : ''}`}>
                        {lesson.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
