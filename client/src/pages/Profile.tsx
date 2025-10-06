import Navbar from "@/components/Navbar";
import AchievementBadge from "@/components/AchievementBadge";
import CertificatePreview from "@/components/CertificatePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Star, Zap, Target, TrendingUp, Settings } from "lucide-react";

export default function Profile() {
  const achievements = [
    { title: "First Quiz Master", description: "Complete first quiz with 100%", icon: Trophy, isUnlocked: true, unlockedDate: "2 days ago" },
    { title: "Week Warrior", description: "7-day learning streak", icon: Zap, isUnlocked: true, unlockedDate: "1 week ago" },
    { title: "Course Completer", description: "Finish your first course", icon: Award, isUnlocked: true, unlockedDate: "2 weeks ago" },
    { title: "Perfect Score", description: "Get 100% on 5 quizzes", icon: Star, isUnlocked: false },
    { title: "Community Helper", description: "Help 10 students in forum", icon: Target, isUnlocked: false },
    { title: "All-Rounder", description: "Complete all course modules", icon: TrendingUp, isUnlocked: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h2 className="font-display font-bold text-2xl" data-testid="text-profile-name">John Doe</h2>
                    <p className="text-muted-foreground" data-testid="text-profile-email">john.doe@example.com</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" data-testid="button-edit-profile">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">24</p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-2">1,580</p>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-3">3</p>
                    <p className="text-sm text-muted-foreground">Certificates</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <AchievementBadge key={achievement.title} {...achievement} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Latest Certificate</CardTitle>
              </CardHeader>
              <CardContent>
                <CertificatePreview
                  courseName="Unlocking Creativity"
                  studentName="John Doe"
                  completionDate="January 15, 2025"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
