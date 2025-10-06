import CourseCard from '../CourseCard'
import budgetingImg from '@assets/generated_images/Budgeting_module_thumbnail_a94e4967.png'

export default function CourseCardExample() {
  return (
    <div className="max-w-sm">
      <CourseCard
        id="1"
        title="Smart Budgeting Basics"
        description="Learn how to create and manage your personal budget effectively"
        thumbnail={budgetingImg}
        progress={65}
        totalLessons={12}
        completedLessons={8}
        duration="2.5 hours"
        ageGroup="10-15"
      />
    </div>
  )
}
