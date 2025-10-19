import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";
import { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: ("learner" | "teacher" | "admin")[];
  children: ReactNode;
  redirectTo?: string;
}

export default function RoleGuard({ allowedRoles, children, redirectTo = "/" }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role as any)) {
    return <Redirect to={redirectTo} />;
  }

  return <>{children}</>;
}
