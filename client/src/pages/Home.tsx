import RoleSelection from "@/components/RoleSelection";
import OnboardingForm from "@/components/OnboardingForm";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import budgetingImg from "@assets/generated_images/Budgeting_module_thumbnail_a94e4967.png";
import creativityImg from "@assets/generated_images/Creativity_module_thumbnail_fe82ef99.png";
import problemSolvingImg from "@assets/generated_images/Problem-solving_module_thumbnail_08a22595.png";
import investingImg from "@assets/generated_images/Investing_module_thumbnail_ebfef553.png";

export default function Home() {
  const [step, setStep] = useState<"role" | "onboarding" | "home">("role");
  const [userRole, setUserRole] = useState<"learner" | "teacher" | null>(null);

  if (step === "role") {
    return <RoleSelection onSelectRole={(role) => {
      setUserRole(role);
      setStep("onboarding");
    }} />;
  }

  if (step === "onboarding" && userRole === "learner") {
    return <OnboardingForm onComplete={() => setStep("home")} />;
  }
  const featuredCourses = [
    {
      id: "1",
      title: "Smart Budgeting Basics",
      description: "Learn how to create and manage your personal budget effectively with practical tips and real-world examples.",
      thumbnail: budgetingImg,
      progress: 0,
      totalLessons: 12,
      completedLessons: 0,
      duration: "2.5 hours",
      ageGroup: "10-15",
    },
    {
      id: "2",
      title: "Creative Problem Solving",
      description: "Develop critical thinking skills and learn innovative approaches to tackle everyday challenges.",
      thumbnail: problemSolvingImg,
      progress: 0,
      totalLessons: 15,
      completedLessons: 0,
      duration: "3 hours",
      ageGroup: "16-19",
    },
    {
      id: "3",
      title: "Unlocking Creativity",
      description: "Explore your creative potential through hands-on projects and interactive exercises.",
      thumbnail: creativityImg,
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      duration: "2 hours",
      ageGroup: "10-15",
    },
    {
      id: "4",
      title: "Investment Fundamentals",
      description: "Understand the basics of investing, compound interest, and building long-term wealth.",
      thumbnail: investingImg,
      progress: 0,
      totalLessons: 18,
      completedLessons: 0,
      duration: "4 hours",
      ageGroup: "20-23",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl mb-2">Featured Courses</h2>
            <p className="text-muted-foreground">Start your learning journey with these popular courses</p>
          </div>
          <Button variant="ghost" className="gap-2" data-testid="button-view-all-courses">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-20">
            <div className="w-32 h-32 rounded-full bg-primary" />
          </div>
          <div className="absolute bottom-20 right-32">
            <div className="w-24 h-24 rounded-full bg-secondary" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Ready to Transform Your Future?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students mastering life skills that matter. Start learning today and unlock your potential.
            </p>
            <Button size="lg" className="gap-2" data-testid="button-start-learning" onClick={() => setStep("role")}>
              Start Learning Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
