import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface DiscussionThreadProps {
  id: string;
  author: string;
  authorInitials: string;
  title: string;
  preview: string;
  replies: number;
  likes: number;
  timeAgo: string;
}

export default function DiscussionThread({
  author,
  authorInitials,
  title,
  preview,
  replies,
  likes,
  timeAgo,
}: DiscussionThreadProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
    console.log('Thread liked:', !isLiked);
  };

  return (
    <Card className="hover-elevate cursor-pointer" data-testid="card-discussion-thread">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-2" data-testid="text-thread-title">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {author} · {timeAgo}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{preview}</p>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 h-8"
            data-testid="button-thread-replies"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{replies} replies</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 h-8 ${isLiked ? 'text-primary' : ''}`}
            onClick={handleLike}
            data-testid="button-thread-like"
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
