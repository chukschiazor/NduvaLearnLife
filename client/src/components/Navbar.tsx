import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, MessageSquare, User, Menu, X, LogIn, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { useState } from "react";
import { useAuth, login } from "@/hooks/useAuth";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const navItems = [
    { path: "/courses", label: "Explore", icon: BookOpen },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/forum", label: "Forum", icon: MessageSquare },
    { path: "/profile", label: "Profile", icon: User },
  ];

  // Add "My Courses" for teachers/admins (course management)
  if (user?.role === "teacher" || user?.role === "admin") {
    navItems.splice(1, 0, { path: "/my-courses", label: "My Courses", icon: Settings });
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="cursor-pointer">
              <Logo size="md" />
            </div>
          </Link>

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path;
                    return (
                      <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={login}
                    data-testid="button-sign-in"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={login}
                    data-testid="button-sign-up"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
