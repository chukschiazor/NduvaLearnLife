import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lightbulb, Users, DollarSign, Video, BookOpen, Rocket, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function TeacherLanding() {
  const benefits = [
    {
      icon: Lightbulb,
      title: "Teach Your Way",
      description: "Create courses on topics you're passionate about. You have complete control over your content and teaching style.",
    },
    {
      icon: Users,
      title: "Inspire Learners",
      description: "Help young people ages 10-21 gain essential life skills, explore their interests, and prepare for their future.",
    },
    {
      icon: DollarSign,
      title: "Get Rewarded",
      description: "Earn money for every student enrollment while building your professional reputation as an educator.",
    },
  ];

  const steps = [
    {
      icon: BookOpen,
      title: "Plan Your Curriculum",
      description: "Start with your expertise and passion. Organize your knowledge into sections and lectures that build on each other.",
      subtext: "We provide tools to help structure your course and identify topics students want to learn.",
    },
    {
      icon: Video,
      title: "Record Your Content",
      description: "Use simple tools like your smartphone or computer. Create video lessons, add resources, and build quizzes.",
      subtext: "Our support team is available to provide feedback and help you create quality content.",
    },
    {
      icon: Rocket,
      title: "Launch Your Course",
      description: "Publish your course and reach thousands of eager learners. Track your impact through student progress and feedback.",
      subtext: "We help promote your course and provide analytics to help you improve over time.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <section 
        className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32"
        data-testid="section-hero"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary"></div>
          <div className="absolute bottom-32 right-20 w-24 h-24 rounded-full bg-secondary"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-accent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl">
              Come Teach with Us
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Become an instructor and change lives — including your own
            </p>
            <Link href="/teach/apply" data-testid="link-get-started">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 bg-card" data-testid="section-benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              So Many Reasons to Start
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover-elevate" data-testid={`card-benefit-${index}`}>
                <CardContent className="pt-6 space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display font-bold text-4xl md:text-5xl text-primary mb-2">
                5,000+
              </div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="font-display font-bold text-4xl md:text-5xl text-primary mb-2">
                8
              </div>
              <div className="text-muted-foreground">Skill Categories</div>
            </div>
            <div>
              <div className="font-display font-bold text-4xl md:text-5xl text-primary mb-2">
                95%
              </div>
              <div className="text-muted-foreground">Completion Rate</div>
            </div>
            <div>
              <div className="font-display font-bold text-4xl md:text-5xl text-primary mb-2">
                50+
              </div>
              <div className="text-muted-foreground">Active Courses</div>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="py-20 bg-card" data-testid="section-process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              How to Begin
            </h2>
          </div>
          
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="grid md:grid-cols-2 gap-8 items-center"
                data-testid={`step-${index}`}
              >
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                      {index + 1}
                    </div>
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-4">{step.title}</h3>
                  <p className="text-lg mb-4">{step.description}</p>
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">How we help you: </span>
                      {step.subtext}
                    </p>
                  </div>
                </div>
                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <step.icon className="h-24 w-24 text-muted-foreground/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="section-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Become an Instructor Today
            </h2>
            <p className="text-xl text-muted-foreground">
              Join us in empowering the next generation with essential life skills
            </p>
            <Link href="/teach/apply" data-testid="link-cta-get-started">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
