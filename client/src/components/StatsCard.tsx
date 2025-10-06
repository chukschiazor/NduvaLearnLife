import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorClass = "text-primary",
}: StatsCardProps) {
  return (
    <Card className="hover-elevate">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold" data-testid={`text-stat-${title.toLowerCase().replace(/\s/g, '-')}`}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-primary/10 ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
