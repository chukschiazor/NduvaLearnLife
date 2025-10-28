import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerProps {
  title: string;
  videoUrl?: string;
  thumbnail?: string;
  duration?: string;
  progress?: number;
  isCompleted?: boolean;
  onMarkComplete?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number, percentWatched: number) => void;
}

export default function VideoPlayer({
  title,
  videoUrl,
  thumbnail,
  duration,
  progress = 0,
  isCompleted = false,
  onMarkComplete,
  onTimeUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const previousVolumeRef = useRef(1); // Remember last volume for unmuting

  // Detect if URL is an embed (YouTube, Vimeo, etc.)
  const isEmbedUrl = videoUrl && (
    videoUrl.includes('youtube.com/embed') ||
    videoUrl.includes('youtu.be') ||
    videoUrl.includes('vimeo.com') ||
    videoUrl.includes('player.vimeo.com')
  );

  // Format time in MM:SS or HH:MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      
      if (total > 0) {
        const percentWatched = (current / total) * 100;
        onTimeUpdate?.(current, total, percentWatched);
      }
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  // Seek to position
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = value[0];
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Volume control
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0; // Sync muted flag with volume
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
      
      // Remember last non-zero volume for unmuting
      if (newVolume > 0) {
        previousVolumeRef.current = newVolume;
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      
      if (newMuted) {
        // Save current volume and mute
        if (volume > 0) {
          previousVolumeRef.current = volume;
        }
        setVolume(0);
      } else {
        // Restore previous volume instead of forcing 1
        const restoreVolume = previousVolumeRef.current || 1;
        setVolume(restoreVolume);
        videoRef.current.volume = restoreVolume;
      }
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // Change playback speed
  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
      setPlaybackRate(nextRate);
    }
  };

  // Handle mouse movement to show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Sync fullscreen state with browser events (handles ESC key exit)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Cleanup controls timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keyboard if not an embed (iframe doesn't support our controls)
      if (isEmbedUrl) return;
      
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'ArrowRight') {
        skip(10);
      } else if (e.key === 'ArrowLeft') {
        skip(-10);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isMuted, isEmbedUrl]);

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onMarkComplete && progress >= 80) {
      onMarkComplete();
    }
  };

  // If no video URL, show placeholder
  if (!videoUrl) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Play className="h-12 w-12 mx-auto mb-2" />
              <p>No video available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative bg-black group"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => !isEmbedUrl && isPlaying && setShowControls(false)}
          data-testid="video-player-container"
        >
          {/* Render iframe for YouTube/Vimeo or video element for direct files */}
          {isEmbedUrl ? (
            <iframe
              src={videoUrl}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              data-testid="video-iframe"
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full aspect-video"
              poster={thumbnail}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onWaiting={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              data-testid="video-element"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Loading Spinner (only for direct videos) */}
          {!isEmbedUrl && isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-12 w-12 text-white animate-spin" />
            </div>
          )}

          {/* Completed Badge */}
          {isCompleted && (
            <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}

          {/* Play/Pause Overlay (only for direct videos, shown when paused) */}
          {!isEmbedUrl && !isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full w-20 h-20 p-0 hover:bg-white/20"
                onClick={togglePlayPause}
                data-testid="button-play-overlay"
              >
                <Play className="h-12 w-12 text-white ml-1" />
              </Button>
            </div>
          )}

          {/* Custom Controls (only for direct videos, not for embeds) */}
          {!isEmbedUrl && (
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
            {/* Progress Bar */}
            <div className="mb-3">
              <Slider
                value={[currentTime]}
                max={videoDuration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
                data-testid="video-progress-slider"
              />
              <div className="flex justify-between text-xs text-white mt-1">
                <span data-testid="text-current-time">{formatTime(currentTime)}</span>
                <span data-testid="text-duration">{formatTime(videoDuration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={togglePlayPause}
                  data-testid="button-play-pause"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                {/* Skip Backward */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => skip(-10)}
                  data-testid="button-skip-back"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                {/* Skip Forward */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => skip(10)}
                  data-testid="button-skip-forward"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={toggleMute}
                    data-testid="button-mute"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20 cursor-pointer"
                    data-testid="volume-slider"
                  />
                </div>

                {/* Playback Speed */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-white hover:bg-white/20 text-xs font-mono"
                  onClick={changePlaybackRate}
                  data-testid="button-playback-speed"
                >
                  {playbackRate}x
                </Button>
              </div>

              {/* Fullscreen */}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={toggleFullscreen}
                data-testid="button-fullscreen"
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          )}
        </div>

        {/* Video Info Section */}
        <div className="p-6 space-y-4">
          <h3 className="font-semibold text-xl" data-testid="text-video-title">
            {title}
          </h3>

          {/* Watch Progress */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Watch progress</span>
                <span className="font-medium" data-testid="text-watch-progress">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Mark as Complete Button */}
          {progress >= 80 && !isCompleted && onMarkComplete && (
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
