import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface VideoPlayerProps {
  title: string;
  thumbnail: string;
  duration: string;
  progress: number;
  isCompleted?: boolean;
  onMarkComplete?: () => void;
}

export default function VideoPlayer({
  title,
  thumbnail,
  duration,
  progress,
  isCompleted = false,
  onMarkComplete,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    console.log('Video playing');
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button
                size="lg"
                className="rounded-full w-16 h-16 p-0"
                onClick={handlePlay}
                data-testid="button-play-video"
              >
                <Play className="h-8 w-8 ml-1" />
              </Button>
            </div>
          )}
          {isCompleted && (
            <div className="absolute top-4 right-4 bg-success text-white rounded-full p-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-xl" data-testid="text-video-title">{title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {duration}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Watch progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {progress >= 90 && !isCompleted && (
            <Button
              className="w-full gap-2"
              onClick={onMarkComplete}
              data-testid="button-mark-complete"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
