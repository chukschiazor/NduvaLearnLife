import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  ageGroup: string;
  isExploreMode?: boolean;
}

export default function CourseCard({
  title,
  description,
  thumbnail,
  progress,
  totalLessons,
  completedLessons,
  duration,
  ageGroup,
  isExploreMode = false,
}: CourseCardProps) {
  const isCompleted = progress === 100;

  return (
    <Card className="group hover-elevate overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <Clock className="h-4 w-4" />
            {duration}
          </div>
        </div>
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-success text-white rounded-full p-1">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg" data-testid={`text-course-title`}>{title}</h3>
          <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
            {ageGroup}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {!isExploreMode && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium" data-testid="text-course-progress">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </div>
          </>
        )}
        {isExploreMode && (
          <div className="text-sm text-muted-foreground">
            {totalLessons} lessons • {duration}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full gap-2" data-testid="button-continue-course">
          <Play className="h-4 w-4" />
          {isExploreMode ? "Start Course" : isCompleted ? "Review Course" : "Continue Learning"}
        </Button>
      </CardFooter>
    </Card>
  );
}
