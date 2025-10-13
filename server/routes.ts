import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCourseSchema, 
  insertEnrollmentSchema, 
  insertPostSchema, 
  insertCommentSchema,
  completeProfileSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // ============ Auth Routes (TEMPORARILY DISABLED FOR DEV) ============
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // TEMPORARY: Return mock user for development
      const user = await (storage as any).getMockUser();
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/auth/complete-profile', async (req: any, res) => {
    try {
      // TEMPORARY: Mock profile completion for development
      const user = await (storage as any).getMockUser();
      res.json(user);
    } catch (error) {
      console.error("Error completing profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // ============ Course Routes ============
  app.get('/api/courses', async (req, res) => {
    try {
      const { ageGroup, difficulty, status } = req.query;
      const courses = await storage.getCourses({
        ageGroup: ageGroup as string,
        difficulty: difficulty as string,
        status: (status as string) || 'published',
      });
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      const lessons = await storage.getLessonsByCourse(course.id);
      res.json({ ...course, lessons });
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', async (req: any, res) => {
    try {
      // TEMPORARY: Use mock user for development
      const user = await (storage as any).getMockUser();
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only teachers can create courses" });
      }

      const courseData = insertCourseSchema.parse({
        ...req.body,
        createdByTeacherId: user.id,
      });

      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // ============ Enrollment Routes ============
  app.get('/api/enrollments/me', async (req: any, res) => {
    try {
      // TEMPORARY: Use mock user for development
      const user = await (storage as any).getMockUser();
      const enrollments = await storage.getUserEnrollments(user.id);
      
      // Fetch course details for each enrollment
      const enrichedEnrollments = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          return { ...enrollment, course };
        })
      );
      
      res.json(enrichedEnrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.post('/api/enrollments', async (req: any, res) => {
    try {
      // TEMPORARY: Use mock user for development
      const user = await (storage as any).getMockUser();
      const enrollmentData = insertEnrollmentSchema.parse({
        ...req.body,
        userId: user.id,
      });

      const enrollment = await storage.enrollInCourse(enrollmentData);
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  // ============ Gamification Routes ============
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get('/api/users/me/badges', async (req: any, res) => {
    try {
      // TEMPORARY: Use mock user for development
      const user = await (storage as any).getMockUser();
      const badges = await storage.getUserBadges(user.id);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  // ============ Community Routes ============
  app.get('/api/posts', async (req, res) => {
    try {
      const { courseId } = req.query;
      const posts = await storage.getPosts(courseId as string);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post('/api/posts', async (req: any, res) => {
    try {
      // TEMPORARY: Use mock user for development
      const user = await (storage as any).getMockUser();
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: user.id,
      });

      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.post('/api/posts/:postId/comments', async (req: any, res) => {
    try {
      // TEMPORARY: Use mock user for development
      const user = await (storage as any).getMockUser();
      const { postId } = req.params;
      
      const commentData = insertCommentSchema.parse({
        ...req.body,
        userId: user.id,
        postId,
      });

      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
