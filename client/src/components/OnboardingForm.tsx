import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Leaf } from "lucide-react";
import Logo from "./Logo";

interface OnboardingFormProps {
  onComplete: (data: any) => void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    interests: [] as string[],
    skillLevel: "",
    age: "",
  });

  const interests = ["Budgeting", "Investing", "Creativity", "Problem Solving", "Entrepreneurship"];
  const skillLevels = ["Beginner", "Intermediate", "Advanced"];
  const ageGroups = ["10-15", "16-19", "20-23"];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Logo size="md" />
      </div>

      <Card className="w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0">
          <Leaf className="h-24 w-24 text-secondary/20 -rotate-12" />
        </div>

        <CardHeader className="relative">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center font-display text-2xl">
            {step === 1 ? "Create Account" : "AI-Enhanced Learning"}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            {step === 1 ? "Join NDUVA and start your journey" : "Tell us about yourself for personalized recommendations"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  data-testid="input-password"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Button
                      key={interest}
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newInterests = formData.interests.includes(interest)
                          ? formData.interests.filter(i => i !== interest)
                          : [...formData.interests, interest];
                        setFormData({ ...formData, interests: newInterests });
                      }}
                      data-testid={`button-interest-${interest.toLowerCase().replace(' ', '-')}`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Skill Level</Label>
                <div className="flex gap-2">
                  {skillLevels.map((level) => (
                    <Button
                      key={level}
                      variant={formData.skillLevel === level ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFormData({ ...formData, skillLevel: level })}
                      data-testid={`button-skill-${level.toLowerCase()}`}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Age Group</Label>
                <div className="flex gap-2">
                  {ageGroups.map((age) => (
                    <Button
                      key={age}
                      variant={formData.age === age ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFormData({ ...formData, age })}
                      data-testid={`button-age-${age}`}
                    >
                      {age}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button className="w-full" onClick={handleNext} data-testid="button-onboarding-next">
            {step === 1 ? "Continue" : "Complete Setup"}
          </Button>

          <div className="flex justify-center gap-2 pt-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
