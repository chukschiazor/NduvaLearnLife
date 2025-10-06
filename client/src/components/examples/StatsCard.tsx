import StatsCard from '../StatsCard'
import { BookOpen } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="max-w-sm">
      <StatsCard
        title="Lessons Completed"
        value={24}
        icon={BookOpen}
        description="Keep up the great work!"
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  )
}
