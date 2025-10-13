import { cn } from "@/lib/utils";

interface NovaProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "inverted" | "circle" | "navy";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export function Nova({ size = "md", variant = "default", className }: NovaProps) {
  const sizeClass = sizeMap[size];

  if (variant === "circle") {
    return (
      <div
        className={cn(
          "rounded-full bg-primary flex items-center justify-center",
          sizeClass,
          className
        )}
      >
        <LeafIcon color="white" className="w-2/3 h-2/3" />
      </div>
    );
  }

  if (variant === "inverted") {
    return (
      <div
        className={cn(
          "rounded-full bg-white dark:bg-card flex items-center justify-center shadow-md",
          sizeClass,
          className
        )}
      >
        <LeafIcon color="primary" className="w-2/3 h-2/3" />
      </div>
    );
  }

  if (variant === "navy") {
    return (
      <div
        className={cn(
          "rounded-full bg-background flex items-center justify-center",
          sizeClass,
          className
        )}
      >
        <LeafIcon color="navy" className="w-2/3 h-2/3" />
      </div>
    );
  }

  return <LeafIcon color="primary" className={cn(sizeClass, className)} />;
}

interface LeafIconProps {
  color?: "primary" | "white" | "navy";
  className?: string;
}

function LeafIcon({ color = "primary", className }: LeafIconProps) {
  const colorClass =
    color === "white"
      ? "fill-white"
      : color === "navy"
        ? "fill-[#1A2332]"
        : "fill-primary";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(colorClass, className)}
      aria-hidden="true"
    >
      {/* Simple geometric leaf inspired by Smart Club plant icon */}
      <path
        d="M50 10 C30 20, 20 40, 25 60 C28 72, 35 82, 45 88 L50 90 L55 88 C65 82, 72 72, 75 60 C80 40, 70 20, 50 10 Z"
        className="transition-all"
      />
      {/* Stem */}
      <rect x="48" y="85" width="4" height="15" rx="2" className="transition-all" />
      {/* Center vein */}
      <line
        x1="50"
        y1="15"
        x2="50"
        y2="75"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
        className="stroke-white dark:stroke-gray-900"
      />
    </svg>
  );
}

// Animated version for celebrations
export function NovaAnimated({ size = "md", className }: Omit<NovaProps, "variant">) {
  return (
    <div
      className={cn(
        "rounded-full bg-primary flex items-center justify-center animate-bounce",
        sizeMap[size],
        className
      )}
    >
      <LeafIcon color="white" className="w-2/3 h-2/3" />
    </div>
  );
}
