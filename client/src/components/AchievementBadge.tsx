import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isUnlocked: boolean;
  unlockedDate?: string;
}

export default function AchievementBadge({
  title,
  description,
  icon: Icon,
  isUnlocked,
  unlockedDate,
}: AchievementBadgeProps) {
  return (
    <Card className={`${!isUnlocked && 'opacity-50'} hover-elevate`}>
      <CardContent className="p-4 text-center space-y-3">
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            isUnlocked
              ? 'bg-gradient-to-br from-warning to-chart-2'
              : 'bg-muted'
          }`}
        >
          <Icon className={`h-8 w-8 ${isUnlocked ? 'text-white' : 'text-muted-foreground'}`} />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold" data-testid="text-achievement-title">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
          {isUnlocked && unlockedDate && (
            <p className="text-xs text-primary font-medium">
              Unlocked {unlockedDate}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
