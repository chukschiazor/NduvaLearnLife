import AchievementBadge from '../AchievementBadge'
import { Trophy } from 'lucide-react'

export default function AchievementBadgeExample() {
  return (
    <div className="max-w-xs">
      <AchievementBadge
        title="First Quiz Master"
        description="Complete your first quiz with 100% score"
        icon={Trophy}
        isUnlocked={true}
        unlockedDate="2 days ago"
      />
    </div>
  )
}
