import LeaderboardTable from '../LeaderboardTable'

export default function LeaderboardTableExample() {
  const mockEntries = [
    { rank: 1, name: "Sarah Johnson", score: 2450, lessonsCompleted: 48, initials: "SJ" },
    { rank: 2, name: "Michael Chen", score: 2380, lessonsCompleted: 45, initials: "MC" },
    { rank: 3, name: "Emma Williams", score: 2250, lessonsCompleted: 42, initials: "EW" },
    { rank: 4, name: "David Brown", score: 2100, lessonsCompleted: 40, initials: "DB" },
    { rank: 5, name: "Lisa Anderson", score: 1950, lessonsCompleted: 38, initials: "LA" },
  ];

  return (
    <div className="max-w-2xl">
      <LeaderboardTable entries={mockEntries} />
    </div>
  )
}
