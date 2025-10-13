import {
  users,
  courses,
  modules,
  courseSessions,
  lessons,
  quizzes,
  quizQuestions,
  quizAnswers,
  enrollments,
  quizAttempts,
  lessonViews,
  badges,
  badgesEarned,
  certificates,
  posts,
  comments,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Module,
  type InsertModule,
  type CourseSession,
  type InsertCourseSession,
  type Lesson,
  type InsertLesson,
  type Quiz,
  type Enrollment,
  type InsertEnrollment,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Badge,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User operations (Replit Auth required)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: "learner" | "teacher" | "admin", dateOfBirth?: string): Promise<User>;
  completeUserProfile(id: string, data: { firstName: string; lastName: string; role: "learner" | "teacher"; dateOfBirth: string; preferences?: any }): Promise<User>;
  
  // Course operations
  createCourse(course: InsertCourse): Promise<Course>;
  getCourse(id: string): Promise<Course | undefined>;
  getCourses(filters?: { ageGroup?: string; difficulty?: string; status?: string }): Promise<Course[]>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course>;
  
  // Module operations (Coursera-style)
  createModule(module: InsertModule): Promise<Module>;
  getModulesByCourse(courseId: string): Promise<Module[]>;
  getModule(id: string): Promise<Module | undefined>;
  
  // Course Session operations
  createCourseSession(session: InsertCourseSession): Promise<CourseSession>;
  getSessionsByModule(moduleId: string): Promise<CourseSession[]>;
  getCourseSession(id: string): Promise<CourseSession | undefined>;
  
  // Lesson operations (legacy)
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessonsByCourse(courseId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  
  // Quiz operations
  getQuizByLesson(lessonId: string): Promise<Quiz | undefined>;
  
  // Enrollment operations
  enrollInCourse(enrollment: InsertEnrollment): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  updateEnrollmentProgress(enrollmentId: string, progress: number, completedLessons: number): Promise<Enrollment>;
  
  // Gamification
  updateUserXP(userId: string, xpToAdd: number): Promise<User>;
  getUserBadges(userId: string): Promise<Badge[]>;
  getLeaderboard(limit?: number): Promise<User[]>;
  
  // Community
  createPost(post: InsertPost): Promise<Post>;
  getPosts(courseId?: string): Promise<Post[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getMockUser(): Promise<User> {
    const mockUserId = "mock-user-123";
    let user = await this.getUser(mockUserId);
    
    if (!user) {
      user = await this.upsertUser({
        id: mockUserId,
        email: "admin@nduva.com",
        firstName: "Demo",
        lastName: "Admin",
        profileImageUrl: null,
      });
      
      // Set them as an admin for testing course creation
      user = await this.updateUserRole(mockUserId, "admin", "1990-01-15");
      
      // Give them some XP and streak
      await db.update(users)
        .set({ 
          xpPoints: 450, 
          currentStreak: 5,
          updatedAt: new Date() 
        })
        .where(eq(users.id, mockUserId));
      
      user = await this.getUser(mockUserId) as User;
    } else if (user.role !== "admin") {
      // Force upgrade existing mock user to admin role
      user = await this.updateUserRole(mockUserId, "admin", user.dateOfBirth || "1990-01-15");
    }
    
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Compute fullName from firstName and lastName if available
    const fullName = userData.firstName && userData.lastName 
      ? `${userData.firstName} ${userData.lastName}`
      : undefined;

    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        fullName,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          fullName,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: "learner" | "teacher" | "admin", dateOfBirth?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        role,
        ...(dateOfBirth && { dateOfBirth }),
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async completeUserProfile(id: string, data: { firstName: string; lastName: string; role: "learner" | "teacher"; dateOfBirth: string; preferences?: any }): Promise<User> {
    const fullName = `${data.firstName} ${data.lastName}`;
    const [user] = await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        fullName,
        role: data.role,
        dateOfBirth: data.dateOfBirth,
        ...(data.preferences && { preferences: data.preferences }),
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Course operations
  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCourses(filters?: { ageGroup?: string; difficulty?: string; status?: string }): Promise<Course[]> {
    let conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(courses.status, filters.status as any));
    }
    
    if (conditions.length > 0) {
      return db.select().from(courses).where(and(...conditions));
    }
    
    return db.select().from(courses);
  }

  async updateCourse(id: string, courseData: Partial<InsertCourse>): Promise<Course> {
    const [course] = await db
      .update(courses)
      .set({ ...courseData, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  // Module operations (Coursera-style)
  async createModule(module: InsertModule): Promise<Module> {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }

  async getModulesByCourse(courseId: string): Promise<Module[]> {
    return db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(modules.sequenceOrder);
  }

  async getModule(id: string): Promise<Module | undefined> {
    const [module] = await db.select().from(modules).where(eq(modules.id, id));
    return module;
  }

  // Course Session operations
  async createCourseSession(session: InsertCourseSession): Promise<CourseSession> {
    const [newSession] = await db.insert(courseSessions).values(session).returning();
    return newSession;
  }

  async getSessionsByModule(moduleId: string): Promise<CourseSession[]> {
    return db.select().from(courseSessions).where(eq(courseSessions.moduleId, moduleId)).orderBy(courseSessions.sequenceOrder);
  }

  async getCourseSession(id: string): Promise<CourseSession | undefined> {
    const [session] = await db.select().from(courseSessions).where(eq(courseSessions.id, id));
    return session;
  }

  // Lesson operations (legacy)
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    
    // Update course total lessons count
    await db.execute(sql`
      UPDATE courses 
      SET total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = ${lesson.courseId})
      WHERE id = ${lesson.courseId}
    `);
    
    return newLesson;
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(lessons.sequenceOrder);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  // Quiz operations
  async getQuizByLesson(lessonId: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId));
    return quiz;
  }

  // Enrollment operations
  async enrollInCourse(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async updateEnrollmentProgress(enrollmentId: string, progress: number, completedLessons: number): Promise<Enrollment> {
    const [enrollment] = await db
      .update(enrollments)
      .set({ 
        progressPercentage: progress, 
        completedLessons,
        lastAccessedAt: new Date()
      })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return enrollment;
  }

  // Gamification
  async updateUserXP(userId: string, xpToAdd: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        xpPoints: sql`${users.xpPoints} + ${xpToAdd}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    const result = await db
      .select({
        id: badges.id,
        name: badges.name,
        description: badges.description,
        iconUrl: badges.iconUrl,
        badgeType: badges.badgeType,
        criteria: badges.criteria,
        xpReward: badges.xpReward,
        createdAt: badges.createdAt,
      })
      .from(badgesEarned)
      .where(eq(badgesEarned.userId, userId))
      .innerJoin(badges, eq(badgesEarned.badgeId, badges.id));
    
    return result;
  }

  async getLeaderboard(limit: number = 100): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(eq(users.isActive, true))
      .orderBy(desc(users.xpPoints))
      .limit(limit);
  }

  // Community
  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPosts(courseId?: string): Promise<Post[]> {
    if (courseId) {
      return db.select().from(posts).where(eq(posts.courseId, courseId)).orderBy(desc(posts.createdAt));
    }
    return db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    
    // Increment comment count on post
    await db.execute(sql`
      UPDATE posts 
      SET comment_count = comment_count + 1 
      WHERE id = ${comment.postId}
    `);
    
    return newComment;
  }
}

export const storage = new DatabaseStorage();
