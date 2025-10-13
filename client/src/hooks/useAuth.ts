import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  // TEMPORARY: Fetch mock user directly (auth bypass for development)
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const completeProfileMutation = useMutation({
    mutationFn: async (data: { 
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

  // TEMPORARY: Always authenticated with mock user
  const isAuthenticated = !isLoading && !!user;
  const needsOnboarding = false; // Skip onboarding for now

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
