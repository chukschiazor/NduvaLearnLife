import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCourseSchema, 
  insertModuleSchema,
  insertCourseSessionSchema,
  insertEnrollmentSchema, 
  insertPostSchema, 
  insertCommentSchema,
  completeProfileSchema,
  insertTeacherApplicationSchema 
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
      const validatedData = completeProfileSchema.parse(req.body);
      
      // TEMPORARY: Use mock user for development
      const mockUser = await (storage as any).getMockUser();
      
      // Update the user profile with onboarding data
      const updatedUser = await storage.completeUserProfile(mockUser.id, validatedData);
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error completing profile:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
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

  // Get teacher's own courses (including drafts)
  app.get('/api/teacher/courses', async (req: any, res) => {
    try {
      const user = await (storage as any).getMockUser();
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only teachers can access this endpoint" });
      }

      const courses = await storage.getCoursesByTeacher(user.id);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
      res.status(500).json({ message: "Failed to fetch teacher courses" });
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

  // Get course analytics (teacher/admin only)
  app.get('/api/courses/:id/analytics', async (req: any, res) => {
    try {
      const user = await (storage as any).getMockUser();
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only teachers/admins can access analytics" });
      }

      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Verify the course belongs to the teacher (unless admin)
      if (user.role === 'teacher' && course.createdByTeacherId !== user.id) {
        return res.status(403).json({ message: "You can only view analytics for your own courses" });
      }

      const analytics = await storage.getCourseAnalytics(req.params.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching course analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
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

  // ============ Module Routes (Admin/Teacher) ============
  app.get('/api/courses/:courseId/modules', async (req, res) => {
    try {
      const modules = await storage.getModulesByCourse(req.params.courseId);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.post('/api/courses/:courseId/modules', async (req: any, res) => {
    try {
      const user = await (storage as any).getMockUser();
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only teachers/admins can create modules" });
      }

      const moduleData = insertModuleSchema.parse({
        ...req.body,
        courseId: req.params.courseId,
      });

      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error) {
      console.error("Error creating module:", error);
      res.status(500).json({ message: "Failed to create module" });
    }
  });

  // ============ Course Session Routes (Admin/Teacher) ============
  app.get('/api/modules/:moduleId/sessions', async (req, res) => {
    try {
      const sessions = await storage.getSessionsByModule(req.params.moduleId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post('/api/modules/:moduleId/sessions', async (req: any, res) => {
    try {
      const user = await (storage as any).getMockUser();
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only teachers/admins can create sessions" });
      }

      const sessionData = insertCourseSessionSchema.parse({
        ...req.body,
        moduleId: req.params.moduleId,
      });

      const session = await storage.createCourseSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Get all sessions for a course (for course builder)
  app.get('/api/courses/:courseId/all-sessions', async (req, res) => {
    try {
      const modules = await storage.getModulesByCourse(req.params.courseId);
      const sessionPromises = modules.map(module => storage.getSessionsByModule(module.id));
      const sessionsArrays = await Promise.all(sessionPromises);
      const allSessions = sessionsArrays.flat();
      res.json(allSessions);
    } catch (error) {
      console.error("Error fetching all sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Delete module
  app.delete('/api/modules/:moduleId', async (req: any, res) => {
    try {
      const user = await (storage as any).getMockUser();
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only teachers/admins can delete modules" });
      }

      await storage.deleteModule(req.params.moduleId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting module:", error);
      res.status(500).json({ message: "Failed to delete module" });
    }
  });

  // Delete session
  app.delete('/api/sessions/:sessionId', async (req: any, res) => {
    try {
      const user = await (storage as any).getMockUser();
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only teachers/admins can delete sessions" });
      }

      await storage.deleteCourseSession(req.params.sessionId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Failed to delete session" });
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

  // ============ Teacher Application Routes ============
  app.post('/api/teacher-applications', async (req: any, res) => {
    try {
      // TEMPORARY: Use mock user for development
      const user = await (storage as any).getMockUser();
      
      // Validate request body
      const applicationData = insertTeacherApplicationSchema.parse(req.body);
      
      // Create the application
      const application = await storage.createTeacherApplication(user.id, applicationData);
      
      res.status(201).json(application);
    } catch (error: any) {
      console.error("Error creating teacher application:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create teacher application" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
