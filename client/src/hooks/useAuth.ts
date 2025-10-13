import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  // DEVELOPMENT MODE: Fetch mock user but always return authenticated
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const completeProfileMutation = useMutation({
    mutationFn: async (data: { 
      firstName: string;
      lastName: string;
      role: "learner" | "teacher"; 
      dateOfBirth: string;
      preferences?: {
        interests?: string[];
        skillLevel?: string;
        learningGoals?: string;
        learningStyle?: string;
      };
    }) => {
      const res = await apiRequest("POST", "/api/auth/complete-profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  // User is authenticated when user data is loaded
  const isAuthenticated = !!user;
  
  // User needs onboarding if they don't have a role set yet
  const needsOnboarding = isAuthenticated && !user.role;

  return {
    user,
    isLoading,
    isAuthenticated,
    needsOnboarding,
    completeProfile: completeProfileMutation.mutateAsync,
    isCompletingProfile: completeProfileMutation.isPending,
  };
}

export function login() {
  window.location.href = "/api/login";
}

export function logout() {
  window.location.href = "/api/logout";
}
