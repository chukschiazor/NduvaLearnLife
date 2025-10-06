import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
}

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onNext,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    console.log('Answer selected:', index, 'Correct:', question.correctAnswer);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    onNext();
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${
                  i < questionNumber ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-xl" data-testid="text-quiz-question">{question.question}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-3">
          {question.options.map((option, index) => {
            let buttonClass = "justify-start text-left h-auto py-4 px-6";
            let variant: "outline" | "default" = "outline";

            if (showFeedback && selectedAnswer === index) {
              if (isCorrect) {
                buttonClass += " border-success text-success bg-success/10";
              } else {
                buttonClass += " border-destructive text-destructive bg-destructive/10";
              }
            } else if (showFeedback && index === question.correctAnswer) {
              buttonClass += " border-success text-success bg-success/10";
            }

            return (
              <Button
                key={index}
                variant={variant}
                className={buttonClass}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                data-testid={`button-quiz-option-${index}`}
              >
                <span className="flex items-center gap-3 w-full">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showFeedback && selectedAnswer === index && (
                    isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 flex-shrink-0" />
                    )
                  )}
                  {showFeedback && index === question.correctAnswer && selectedAnswer !== index && (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  )}
                </span>
              </Button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
            <p className={`font-medium ${isCorrect ? 'text-success' : 'text-destructive'}`}>
              {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
            </p>
            <p className="text-sm mt-1 text-muted-foreground">
              {isCorrect
                ? 'Great job! You got it right.'
                : `The correct answer is: ${question.options[question.correctAnswer]}`}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!showFeedback}
          data-testid="button-quiz-next"
        >
          {questionNumber === totalQuestions ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </CardFooter>
    </Card>
  );
}
