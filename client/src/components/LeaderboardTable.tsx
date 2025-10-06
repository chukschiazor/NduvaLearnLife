import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  lessonsCompleted: number;
  initials: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-warning" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-5 w-5 text-chart-4" />;
    return <span className="text-sm font-semibold text-muted-foreground">{rank}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all-time" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" data-testid="tab-daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly</TabsTrigger>
            <TabsTrigger value="all-time" data-testid="tab-all-time">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value="all-time" className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center gap-4 p-3 rounded-lg hover-elevate"
                data-testid={`leaderboard-entry-${entry.rank}`}
              >
                <div className="w-8 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {entry.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" data-testid={`text-user-name-${entry.rank}`}>{entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.lessonsCompleted} lessons
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-primary" data-testid={`text-user-score-${entry.rank}`}>
                    {entry.score}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="daily" className="space-y-3">
            <p className="text-center text-muted-foreground py-8">Daily rankings will be shown here</p>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-3">
            <p className="text-center text-muted-foreground py-8">Weekly rankings will be shown here</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
