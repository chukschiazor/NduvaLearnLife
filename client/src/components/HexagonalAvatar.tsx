import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HexagonalAvatarProps {
  src?: string | null;
  fallback: string;
  size?: "sm" | "md" | "lg";
}

export default function HexagonalAvatar({ src, fallback, size = "md" }: HexagonalAvatarProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40"
  };

  return (
    <div 
      className="relative" 
      data-testid="hexagonal-avatar-wrapper"
      style={{ 
        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      }}
    >
      <Avatar className={`${sizeClasses[size]} rounded-none`}>
        {src && <AvatarImage src={src || undefined} alt={fallback} />}
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold rounded-none">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
