import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeacherApplicationSchema, type InsertTeacherApplication } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DollarSign, Wrench, HeartPulse, Users, Lightbulb, Shield, MessageCircle, Briefcase, Loader2 } from "lucide-react";

const expertiseOptions = [
  { id: "Money & Finance", label: "Money & Finance", icon: DollarSign },
  { id: "Practical Life Skills", label: "Practical Life Skills", icon: Wrench },
  { id: "Health & Personal Development", label: "Health & Personal Development", icon: HeartPulse },
  { id: "Social Skills", label: "Social Skills", icon: Users },
  { id: "Technology & Innovation", label: "Technology & Innovation", icon: Lightbulb },
  { id: "Safety & Survival", label: "Safety & Survival", icon: Shield },
  { id: "Culture & Communication", label: "Culture & Communication", icon: MessageCircle },
  { id: "Entrepreneurship & Business", label: "Entrepreneurship & Business", icon: Briefcase },
];

export default function TeacherApplication() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<InsertTeacherApplication>({
    resolver: zodResolver(insertTeacherApplicationSchema),
    defaultValues: {
      expertiseAreas: [],
      teachingExperience: "",
      courseIdeas: "",
      bio: "",
      websiteUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertTeacherApplication) => {
      const res = await apiRequest("POST", "/api/teacher-applications", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon.",
      });
      setLocation("/teach/success");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTeacherApplication) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Become a NDUVA Teacher</h1>
          <p className="text-muted-foreground text-lg">
            Share your expertise and help students master essential life skills
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Expertise Areas</CardTitle>
                <CardDescription>
                  Select the life skills categories you're qualified to teach (select at least one)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="expertiseAreas"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {expertiseOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="expertiseAreas"
                            render={({ field }) => {
                              const IconComponent = option.icon;
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      data-testid={`checkbox-expertise-${option.id.toLowerCase().replace(/\s+/g, '-')}`}
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4 text-primary" />
                                    <FormLabel className="font-normal cursor-pointer">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teaching Experience</CardTitle>
                <CardDescription>
                  Tell us about your teaching background (minimum 50 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="teachingExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          data-testid="textarea-teaching-experience"
                          placeholder="Describe your teaching experience, certifications, or relevant background..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length} / 50 characters minimum
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Ideas</CardTitle>
                <CardDescription>
                  What courses would you like to create? (minimum 50 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="courseIdeas"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          data-testid="textarea-course-ideas"
                          placeholder="Share your ideas for courses you'd like to teach on our platform..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length} / 50 characters minimum
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About You</CardTitle>
                <CardDescription>
                  Tell us about yourself (minimum 100 characters)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          data-testid="textarea-bio"
                          placeholder="Share your background, passion for teaching, and what makes you unique..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length} / 100 characters minimum
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links (Optional)</CardTitle>
                <CardDescription>
                  Help us learn more about you through your online presence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-website-url"
                          type="url"
                          placeholder="https://yourwebsite.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-linkedin-url"
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-twitter-url"
                          type="url"
                          placeholder="https://twitter.com/yourhandle"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/teach")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                data-testid="button-submit"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
