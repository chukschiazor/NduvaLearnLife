import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import StatsCard from "@/components/StatsCard";
import { BookOpen, Target, TrendingUp, Flame } from "lucide-react";
import budgetingImg from "@assets/generated_images/Budgeting_module_thumbnail_a94e4967.png";
import creativityImg from "@assets/generated_images/Creativity_module_thumbnail_fe82ef99.png";
import problemSolvingImg from "@assets/generated_images/Problem-solving_module_thumbnail_08a22595.png";
import investingImg from "@assets/generated_images/Investing_module_thumbnail_ebfef553.png";

export default function Courses() {
  const stats = [
    { title: "Lessons Completed", value: 24, icon: BookOpen, description: "Keep up the great work!", trend: { value: 12, isPositive: true } },
    { title: "Quiz Average", value: "87%", icon: Target, description: "Above average", trend: { value: 5, isPositive: true } },
    { title: "Learning Streak", value: "7 days", icon: Flame, description: "Personal best!", colorClass: "text-warning" },
    { title: "Overall Progress", value: "65%", icon: TrendingUp, description: "On track", colorClass: "text-chart-3" },
  ];

  const courses = [
    {
      id: "1",
      title: "Smart Budgeting Basics",
      description: "Learn how to create and manage your personal budget effectively with practical tips and real-world examples.",
      thumbnail: budgetingImg,
      progress: 65,
      totalLessons: 12,
      completedLessons: 8,
      duration: "2.5 hours",
      ageGroup: "10-15",
    },
    {
      id: "2",
      title: "Creative Problem Solving",
      description: "Develop critical thinking skills and learn innovative approaches to tackle everyday challenges.",
      thumbnail: problemSolvingImg,
      progress: 40,
      totalLessons: 15,
      completedLessons: 6,
      duration: "3 hours",
      ageGroup: "16-19",
    },
    {
      id: "3",
      title: "Unlocking Creativity",
      description: "Explore your creative potential through hands-on projects and interactive exercises.",
      thumbnail: creativityImg,
      progress: 100,
      totalLessons: 10,
      completedLessons: 10,
      duration: "2 hours",
      ageGroup: "10-15",
    },
    {
      id: "4",
      title: "Investment Fundamentals",
      description: "Understand the basics of investing, compound interest, and building long-term wealth.",
      thumbnail: investingImg,
      progress: 20,
      totalLessons: 18,
      completedLessons: 4,
      duration: "4 hours",
      ageGroup: "20-23",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">My Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mb-6">
          <h2 className="font-display font-bold text-2xl mb-2">My Courses</h2>
          <p className="text-muted-foreground">Continue where you left off</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}
