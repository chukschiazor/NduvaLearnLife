import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscussionThread from "@/components/DiscussionThread";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Forum() {
  const threads = [
    {
      id: "1",
      author: "Alex Rivera",
      authorInitials: "AR",
      title: "How do you stay motivated while learning budgeting?",
      preview: "I've been trying to learn about budgeting but sometimes find it challenging to stay consistent. What strategies do you use to keep yourself motivated?",
      replies: 12,
      likes: 24,
      timeAgo: "2 hours ago",
    },
    {
      id: "2",
      author: "Jamie Lee",
      authorInitials: "JL",
      title: "Best resources for understanding investment basics?",
      preview: "I'm new to investing and looking for beginner-friendly resources. What would you recommend for someone just starting out?",
      replies: 8,
      likes: 15,
      timeAgo: "5 hours ago",
    },
    {
      id: "3",
      author: "Taylor Chen",
      authorInitials: "TC",
      title: "Sharing my creative project - feedback welcome!",
      preview: "Just finished the creativity module and created a project combining art and problem-solving. Would love to hear your thoughts!",
      replies: 20,
      likes: 42,
      timeAgo: "1 day ago",
    },
    {
      id: "4",
      author: "Morgan Blake",
      authorInitials: "MB",
      title: "Tips for acing the problem-solving quizzes?",
      preview: "I'm struggling with some of the advanced problem-solving questions. Does anyone have study tips or strategies that worked for them?",
      replies: 15,
      likes: 28,
      timeAgo: "1 day ago",
    },
    {
      id: "5",
      author: "Casey Jordan",
      authorInitials: "CJ",
      title: "Weekly study group - join us!",
      preview: "We're organizing a weekly virtual study session to discuss course materials and help each other. Everyone is welcome to join!",
      replies: 32,
      likes: 56,
      timeAgo: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Community Forum</h1>
          <p className="text-muted-foreground">Connect with fellow learners and share your journey</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="pl-10"
              data-testid="input-search-forum"
            />
          </div>
          <Button className="gap-2" data-testid="button-new-discussion">
            <Plus className="h-4 w-4" />
            New Discussion
          </Button>
        </div>

        <div className="space-y-4">
          {threads.map((thread) => (
            <DiscussionThread key={thread.id} {...thread} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
