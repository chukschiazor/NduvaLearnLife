import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  const completeProfileMutation = useMutation({
    mutationFn: async (data: { role: "learner" | "teacher"; dateOfBirth: string }) => {
      const res = await apiRequest("POST", "/api/auth/complete-profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const isAuthenticated = !isLoading && !error && !!user;
  const needsOnboarding = isAuthenticated && !user?.dateOfBirth;

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
