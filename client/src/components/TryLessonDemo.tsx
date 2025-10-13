import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Nova, NovaAnimated } from "@/components/Nova";
import { X, Play, CheckCircle2, XCircle, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TryLessonDemoProps {
  onClose: () => void;
}

export function TryLessonDemo({ onClose }: TryLessonDemoProps) {
  const [step, setStep] = useState<"video" | "quiz" | "celebration">("video");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleVideoComplete = () => {
    setStep("quiz");
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    // If correct, move to celebration after a delay
    if (index === 1) {
      setTimeout(() => {
        setStep("celebration");
      }, 1500);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-3xl max-w-3xl w-full shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          data-testid="button-close-demo"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "video" && <VideoStep onComplete={handleVideoComplete} />}
        {step === "quiz" && (
          <QuizStep 
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            onAnswerSelect={handleAnswerSelect}
            onRetry={handleRetry}
          />
        )}
        {step === "celebration" && <CelebrationStep onClose={onClose} />}
      </div>
    </div>
  );
}

function VideoStep({ onComplete }: { onComplete: () => void }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    // Simulate 5-second video
    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  return (
    <div className="p-8 md:p-12">
      <div className="text-center space-y-6">
        <Nova size="lg" variant="circle" />
        <h2 className="text-3xl font-bold font-display">Quick Budgeting Basics</h2>
        <p className="text-muted-foreground text-lg">
          Let's learn how to save money smartly!
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="mt-8 bg-muted rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
        {!playing ? (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
            data-testid="button-play-video"
          >
            <div className="bg-primary p-6 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </button>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Playing lesson...</p>
            </div>
          </div>
        )}
        {/* Placeholder Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-success/10 flex items-center justify-center">
          <Nova size="xl" variant="navy" className="opacity-20" />
        </div>
      </div>
    </div>
  );
}

interface QuizStepProps {
  selectedAnswer: number | null;
  showFeedback: boolean;
  onAnswerSelect: (index: number) => void;
  onRetry: () => void;
}

function QuizStep({ selectedAnswer, showFeedback, onAnswerSelect, onRetry }: QuizStepProps) {
  const question = "What's the best first step when starting a budget?";
  const answers = [
    "Buy whatever you want",
    "Track your income and expenses",
    "Ignore your spending",
    "Only save once a year",
  ];
  const correctAnswer = 1;

  return (
    <div className="p-8 md:p-12">
      <div className="text-center space-y-4 mb-8">
        <Nova size="md" variant="circle" />
        <h2 className="text-2xl font-bold font-display">Quick Check!</h2>
        <p className="text-lg text-card-foreground">{question}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === correctAnswer;
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => !showFeedback && onAnswerSelect(index)}
              disabled={showFeedback}
              className={cn(
                "p-6 rounded-2xl border-2 text-left transition-all relative",
                !showFeedback && "hover:border-primary hover:shadow-md hover-elevate",
                showCorrect && "border-success bg-success/10",
                showIncorrect && "border-destructive bg-destructive/10",
                !showFeedback && !isSelected && "border-border",
                isSelected && !showFeedback && "border-primary bg-primary/5"
              )}
              data-testid={`quiz-answer-${index}`}
            >
              <span className="text-base">{answer}</span>
              {showCorrect && (
                <CheckCircle2 className="absolute top-6 right-6 h-6 w-6 text-success" />
              )}
              {showIncorrect && (
                <XCircle className="absolute top-6 right-6 h-6 w-6 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {showFeedback && selectedAnswer !== correctAnswer && (
        <div className="mt-6 text-center">
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="rounded-xl"
            data-testid="button-retry-quiz"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

function CelebrationStep({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-8 md:p-12 text-center space-y-8">
      <NovaAnimated size="xl" />
      
      <div className="space-y-4">
        <h2 className="text-4xl font-bold font-display text-primary">
          Perfect! 
        </h2>
        <p className="text-xl text-muted-foreground">
          You're a natural learner!
        </p>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          Ready to unlock 50+ courses and start earning XP, badges, and certificates?
        </p>
      </div>

      <div className="bg-accent/50 rounded-2xl p-6 max-w-md mx-auto">
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="text-3xl font-bold text-primary">+10</div>
            <div className="text-sm text-muted-foreground">XP Earned</div>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-1">
              <Sparkles className="h-6 w-6 text-success" />
            </div>
            <div className="text-sm text-muted-foreground">First Step</div>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-1">
              <Zap className="h-6 w-6 text-warning" />
            </div>
            <div className="text-sm text-muted-foreground">Quick Learner</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          size="lg" 
          className="w-full rounded-xl text-lg"
          onClick={() => {
            onClose();
            // Navigate to login
            window.location.href = "/api/login";
          }}
          data-testid="button-start-learning"
        >
          Start Learning Now
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full rounded-xl"
          onClick={onClose}
          data-testid="button-maybe-later"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  );
}
