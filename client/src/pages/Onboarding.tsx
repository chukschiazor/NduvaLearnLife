import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, GraduationCap, Sparkles, Target, Brain, Rocket, Book, Palette, Calculator, Globe, Heart, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

type OnboardingStep = "role" | "learner-info" | "learner-preferences";

const interestOptions = [
  { id: "science", label: "Science", icon: Sparkles },
  { id: "math", label: "Mathematics", icon: Calculator },
  { id: "arts", label: "Arts & Creativity", icon: Palette },
  { id: "technology", label: "Technology", icon: Rocket },
  { id: "finance", label: "Finance & Money", icon: Globe },
  { id: "health", label: "Health & Wellness", icon: Heart },
  { id: "music", label: "Music", icon: Music },
  { id: "reading", label: "Reading & Writing", icon: Book },
];

const skillLevels = [
  { id: "beginner", label: "Beginner", desc: "Just starting out" },
  { id: "intermediate", label: "Intermediate", desc: "Some experience" },
  { id: "advanced", label: "Advanced", desc: "Ready for challenges" },
];

const learningStyles = [
  { id: "visual", label: "Visual", desc: "I learn best by seeing", icon: "👀" },
  { id: "hands-on", label: "Hands-on", desc: "I learn by doing", icon: "✋" },
  { id: "reading", label: "Reading", desc: "I prefer text content", icon: "📚" },
  { id: "listening", label: "Listening", desc: "I learn by hearing", icon: "👂" },
];

export default function Onboarding() {
  const { completeProfile, isCompletingProfile } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<OnboardingStep>("role");
  const [role, setRole] = useState<"learner" | "teacher">("learner");
  
  // Learner form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [learningStyle, setLearningStyle] = useState("");

  const handleRoleSelect = (selectedRole: "learner" | "teacher") => {
    setRole(selectedRole);
    if (selectedRole === "learner") {
      setStep("learner-info");
    } else {
      // For teachers, we'll implement this later
      toast({
        title: "Teacher onboarding coming soon!",
        description: "We're working on the teacher experience. Please check back soon.",
      });
    }
  };

  const handleBasicInfoNext = () => {
    if (!firstName || !lastName || !dateOfBirth) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue",
        variant: "destructive",
      });
      return;
    }
    setStep("learner-preferences");
  };

  const toggleInterest = (interestId: string) => {
    setInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(i => i !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async () => {
    if (!skillLevel || !learningStyle || interests.length === 0) {
      toast({
        title: "Complete your profile",
        description: "Please select your interests, skill level, and learning style",
        variant: "destructive",
      });
      return;
    }

    try {
      await completeProfile({ 
        role, 
        dateOfBirth,
        preferences: {
          interests,
          skillLevel,
          learningGoals,
          learningStyle,
        }
      });
      
      toast({
        title: "Welcome to NDUVA!",
        description: "Your personalized learning journey is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getProgress = () => {
    if (step === "role") return 0;
    if (step === "learner-info") return 33;
    if (step === "learner-preferences") return 66;
    return 100;
  };

  // Role Selection Step
  if (step === "role") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 opacity-20">
          <Sparkles className="h-32 w-32 text-primary animate-pulse" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <Target className="h-24 w-24 text-secondary animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Welcome to <span className="text-primary">NDUVA</span>!
            </h1>
            <p className="text-xl text-muted-foreground">Choose your journey</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Learner Card */}
            <Card 
              className="p-8 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 border-2 hover:border-primary/50 group"
              onClick={() => handleRoleSelect("learner")}
              data-testid="card-select-learner"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <User className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl mb-2">Learner</h3>
                  <p className="text-muted-foreground">
                    Discover new skills, earn badges, and join a community of learners
                  </p>
                </div>
                <Button className="w-full gap-2" data-testid="button-select-learner">
                  Start Learning
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Teacher Card */}
            <Card 
              className="p-8 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 border-2 hover:border-secondary/50 group"
              onClick={() => handleRoleSelect("teacher")}
              data-testid="card-select-teacher"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-6 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <GraduationCap className="h-16 w-16 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl mb-2">Teacher</h3>
                  <p className="text-muted-foreground">
                    Create courses, inspire students, and share your knowledge with AI assistance
                  </p>
                </div>
                <Button className="w-full gap-2" variant="outline" data-testid="button-select-teacher">
                  Start Teaching
                  <Brain className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Learner Basic Info Step
  if (step === "learner-info") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="w-full max-w-2xl">
          <Progress value={getProgress()} className="mb-8" />
          
          <Card className="p-8">
            <div className="mb-8">
              <h2 className="font-display font-bold text-3xl mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">Help us personalize your learning experience</p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    data-testid="input-firstName"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    data-testid="input-lastName"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  data-testid="input-dateOfBirth"
                />
                <p className="text-xs text-muted-foreground">
                  We use this to provide age-appropriate content
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("role")}
                  data-testid="button-back"
                >
                  Back
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleBasicInfoNext}
                  data-testid="button-next"
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Learner Preferences Step
  if (step === "learner-preferences") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="w-full max-w-4xl">
          <Progress value={getProgress()} className="mb-8" />
          
          <Card className="p-8">
            <div className="mb-8">
              <h2 className="font-display font-bold text-3xl mb-2">Personalize your learning</h2>
              <p className="text-muted-foreground">This helps us tailor content just for you</p>
            </div>

            <div className="space-y-8">
              {/* Interests */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">What are you interested in? (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interestOptions.map((interest) => {
                    const Icon = interest.icon;
                    const isSelected = interests.includes(interest.id);
                    return (
                      <Card
                        key={interest.id}
                        className={`p-4 cursor-pointer transition-all hover-elevate active-elevate-2 ${
                          isSelected ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => toggleInterest(interest.id)}
                        data-testid={`card-interest-${interest.id}`}
                      >
                        <div className="flex flex-col items-center text-center gap-2">
                          <Icon className={`h-8 w-8 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                            {interest.label}
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Skill Level */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">What's your skill level?</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  {skillLevels.map((level) => (
                    <Card
                      key={level.id}
                      className={`p-4 cursor-pointer transition-all hover-elevate active-elevate-2 ${
                        skillLevel === level.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSkillLevel(level.id)}
                      data-testid={`card-skill-${level.id}`}
                    >
                      <div className="text-center">
                        <div className={`font-semibold mb-1 ${skillLevel === level.id ? 'text-primary' : ''}`}>
                          {level.label}
                        </div>
                        <div className="text-sm text-muted-foreground">{level.desc}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Learning Style */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">How do you learn best?</Label>
                <div className="grid md:grid-cols-4 gap-4">
                  {learningStyles.map((style) => (
                    <Card
                      key={style.id}
                      className={`p-4 cursor-pointer transition-all hover-elevate active-elevate-2 ${
                        learningStyle === style.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setLearningStyle(style.id)}
                      data-testid={`card-learning-style-${style.id}`}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-3xl">{style.icon}</div>
                        <div className={`font-semibold ${learningStyle === style.id ? 'text-primary' : ''}`}>
                          {style.label}
                        </div>
                        <div className="text-xs text-muted-foreground">{style.desc}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Learning Goals */}
              <div className="space-y-2">
                <Label htmlFor="learningGoals" className="text-lg font-semibold">
                  What do you hope to achieve? (Optional)
                </Label>
                <Textarea
                  id="learningGoals"
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  placeholder="Tell us about your learning goals..."
                  rows={4}
                  data-testid="textarea-learningGoals"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("learner-info")}
                  data-testid="button-back-to-info"
                >
                  Back
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={handleSubmit}
                  disabled={isCompletingProfile}
                  data-testid="button-complete-profile"
                >
                  {isCompletingProfile ? "Setting up..." : "Complete Profile"}
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
