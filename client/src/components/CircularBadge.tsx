import { LucideIcon } from "lucide-react";

interface CircularBadgeProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

export default function CircularBadge({ icon: Icon, label, isActive = true }: CircularBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-2" data-testid={`badge-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={`
        w-16 h-16 rounded-full flex items-center justify-center
        ${isActive 
          ? 'bg-primary/10 border-2 border-primary' 
          : 'bg-muted border-2 border-muted-foreground/20'
        }
      `}>
        <Icon className={`h-8 w-8 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <span className="text-xs text-center text-muted-foreground">{label}</span>
    </div>
  );
}
