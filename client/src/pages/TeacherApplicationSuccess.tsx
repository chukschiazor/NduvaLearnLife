import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function TeacherApplicationSuccess() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" data-testid="icon-success" />
          </div>
          <CardTitle className="text-3xl mb-2">Application Submitted!</CardTitle>
          <CardDescription className="text-base">
            Thank you for your interest in becoming a NDUVA teacher
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground" data-testid="text-review-message">
            We'll review your application and get back to you within 2-3 business days.
          </p>
          
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Our team will review your application and credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>You'll receive an email with the decision</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>If approved, you'll get access to the course creation tools</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/">
              <Button variant="outline" data-testid="button-home">
                Go to Home
              </Button>
            </Link>
            <Link href="/teach">
              <Button data-testid="button-teacher-info">
                Learn More About Teaching
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
