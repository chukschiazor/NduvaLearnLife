import logoLight from "@assets/nduva logo white_1759804971831.png";
import logoDark from "@assets/Nduva logo black_1759804971830.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  return (
    <>
      <img
        src={logoDark}
        alt="NDUVA"
        className={`dark:hidden ${sizeClasses[size]} ${className}`}
      />
      <img
        src={logoLight}
        alt="NDUVA"
        className={`hidden dark:block ${sizeClasses[size]} ${className}`}
      />
    </>
  );
}
