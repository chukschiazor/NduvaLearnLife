import { Link } from "wouter";
import Logo from "./Logo";
import { BookOpen, Users, Award, MessageSquare, GraduationCap } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground">
              Master life skills through interactive, gamified learning experiences.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/courses" data-testid="footer-link-courses">
                  <a className="hover:text-foreground transition-colors flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Browse Courses
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" data-testid="footer-link-leaderboard">
                  <a className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Leaderboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/forum" data-testid="footer-link-forum">
                  <a className="hover:text-foreground transition-colors flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Community
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Teachers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/teach" data-testid="footer-link-teach">
                  <a className="hover:text-foreground transition-colors flex items-center gap-2 font-medium text-primary">
                    <GraduationCap className="h-4 w-4" />
                    Teach on NDUVA
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/teach#benefits" data-testid="footer-link-benefits">
                  <a className="hover:text-foreground transition-colors">Why Teach</a>
                </Link>
              </li>
              <li>
                <Link href="/teach#process" data-testid="footer-link-process">
                  <a className="hover:text-foreground transition-colors">How It Works</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} NDUVA. Empowering the next generation with life skills.</p>
        </div>
      </div>
    </footer>
  );
}
