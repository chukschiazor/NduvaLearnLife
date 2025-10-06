import Navbar from "@/components/Navbar";
import LeaderboardTable from "@/components/LeaderboardTable";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Award, Target } from "lucide-react";

export default function Leaderboard() {
  const leaderboardEntries = [
    { rank: 1, name: "Sarah Johnson", score: 2450, lessonsCompleted: 48, initials: "SJ" },
    { rank: 2, name: "Michael Chen", score: 2380, lessonsCompleted: 45, initials: "MC" },
    { rank: 3, name: "Emma Williams", score: 2250, lessonsCompleted: 42, initials: "EW" },
    { rank: 4, name: "David Brown", score: 2100, lessonsCompleted: 40, initials: "DB" },
    { rank: 5, name: "Lisa Anderson", score: 1950, lessonsCompleted: 38, initials: "LA" },
    { rank: 6, name: "James Wilson", score: 1850, lessonsCompleted: 36, initials: "JW" },
    { rank: 7, name: "Sophia Martinez", score: 1750, lessonsCompleted: 34, initials: "SM" },
    { rank: 8, name: "Oliver Taylor", score: 1650, lessonsCompleted: 32, initials: "OT" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank among other learners</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-warning/10 to-chart-2/10 border-warning/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-warning/20">
                  <Trophy className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Rank</p>
                  <p className="text-3xl font-bold" data-testid="text-user-rank">#12</p>
                  <p className="text-sm text-muted-foreground mt-1">Out of 5,000 students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                  <p className="text-3xl font-bold" data-testid="text-user-total-score">1,580</p>
                  <p className="text-sm text-success mt-1">↑ 120 this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-3/10">
                  <Award className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Achievements</p>
                  <p className="text-3xl font-bold" data-testid="text-user-achievements">8</p>
                  <p className="text-sm text-muted-foreground mt-1">Badges unlocked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <LeaderboardTable entries={leaderboardEntries} />
      </div>
    </div>
  );
}
