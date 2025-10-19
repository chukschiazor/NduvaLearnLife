import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  integer, 
  boolean, 
  timestamp, 
  date,
  jsonb,
  pgEnum,
  decimal,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const roleEnum = pgEnum("role", ["learner", "teacher", "admin"]);
export const ageGroupEnum = pgEnum("age_group", ["10-13", "14-17", "18-21"]);
export const difficultyEnum = pgEnum("difficulty", ["beginner", "intermediate", "advanced"]);
export const courseStatusEnum = pgEnum("course_status", ["draft", "published", "archived"]);
export const lessonTypeEnum = pgEnum("lesson_type", ["video", "project", "quiz"]);
export const questionTypeEnum = pgEnum("question_type", ["multiple_choice", "true_false", "short_answer"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["active", "completed", "dropped"]);
export const badgeTypeEnum = pgEnum("badge_type", ["achievement", "streak", "completion", "community"]);
export const postTypeEnum = pgEnum("post_type", ["discussion", "question", "project_showcase"]);
export const contentStatusEnum = pgEnum("content_status", ["active", "hidden", "deleted"]);
export const flagContentTypeEnum = pgEnum("flag_content_type", ["post", "comment"]);
export const flagReasonEnum = pgEnum("flag_reason", ["spam", "inappropriate", "harassment", "other"]);
export const flagStatusEnum = pgEnum("flag_status", ["pending", "reviewed", "actioned", "dismissed"]);
export const eventCategoryEnum = pgEnum("event_category", ["engagement", "learning", "social", "system"]);
export const consentTypeEnum = pgEnum("consent_type", ["data_collection", "marketing"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "approved", "rejected"]);

// Session storage table (required by Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    expireIdx: index("IDX_session_expire").on(table.expire),
  })
);

// Users table (merged Replit Auth + Learning Platform fields)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Replit Auth fields
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Learning Platform fields
  fullName: text("full_name"), // Computed from firstName + lastName or manually entered
  dateOfBirth: date("date_of_birth"),
  role: roleEnum("role").notNull().default("learner"),
  xpPoints: integer("xp_points").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  lastActiveDate: date("last_active_date"),
  preferences: jsonb("preferences").default({}).notNull(),
  // Teacher profile fields
  bio: text("bio"),
  expertiseAreas: jsonb("expertise_areas").default([]),
  websiteUrl: text("website_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  teachingExperience: text("teaching_experience"),
  // System fields
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  parentId: varchar("parent_id"),
});

// Teacher applications
export const teacherApplications = pgTable("teacher_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  expertiseAreas: jsonb("expertise_areas").notNull().default([]),
  teachingExperience: text("teaching_experience").notNull(),
  courseIdeas: text("course_ideas").notNull(),
  bio: text("bio").notNull(),
  websiteUrl: text("website_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Parental consents
export const parentalConsents = pgTable("parental_consents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  childUserId: varchar("child_user_id").notNull().references(() => users.id),
  parentEmail: text("parent_email").notNull(),
  parentName: text("parent_name").notNull(),
  consentType: consentTypeEnum("consent_type").notNull(),
  granted: boolean("granted").notNull().default(false),
  verificationToken: text("verification_token").notNull(),
  verifiedAt: timestamp("verified_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Courses
export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  createdByTeacherId: varchar("created_by_teacher_id").notNull().references(() => users.id),
  ageGroup: ageGroupEnum("age_group").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  estimatedDurationMinutes: integer("estimated_duration_minutes"),
  learningObjectives: jsonb("learning_objectives").notNull().default([]),
  status: courseStatusEnum("status").notNull().default("draft"),
  totalLessons: integer("total_lessons").notNull().default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Modules (Coursera-style course organization)
export const modules = pgTable("modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  sequenceOrder: integer("sequence_order").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Course Sessions (video content within modules - Coursera style)
export const courseSessions = pgTable("course_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull().references(() => modules.id),
  sequenceOrder: integer("sequence_order").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  durationSeconds: integer("duration_seconds"),
  transcript: jsonb("transcript"),
  captions: jsonb("captions"),
  lessonType: lessonTypeEnum("lesson_type").notNull().default("video"),
  prerequisites: jsonb("prerequisites").default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Keep legacy lessons table for backward compatibility (can be migrated later)
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  sequenceOrder: integer("sequence_order").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"),
  durationSeconds: integer("duration_seconds"),
  transcript: jsonb("transcript"),
  captions: jsonb("captions"),
  lessonType: lessonTypeEnum("lesson_type").notNull().default("video"),
  prerequisites: jsonb("prerequisites").default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  title: text("title").notNull(),
  passingScorePercentage: integer("passing_score_percentage").notNull().default(70),
  timeLimitMinutes: integer("time_limit_minutes"),
  shuffleQuestions: boolean("shuffle_questions").notNull().default(false),
  maxAttempts: integer("max_attempts").default(3),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Quiz Questions
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").notNull().references(() => quizzes.id),
  sequenceOrder: integer("sequence_order").notNull(),
  questionText: text("question_text").notNull(),
  questionType: questionTypeEnum("question_type").notNull(),
  correctAnswer: jsonb("correct_answer").notNull(),
  explanation: text("explanation"),
  points: integer("points").notNull().default(10),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Quiz Answers (for multiple choice)
export const quizAnswers = pgTable("quiz_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionId: varchar("question_id").notNull().references(() => quizQuestions.id),
  answerText: text("answer_text").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
  sequenceOrder: integer("sequence_order").notNull(),
});

// Enrollments
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  enrolledAt: date("enrolled_at").notNull().defaultNow(),
  progressPercentage: integer("progress_percentage").notNull().default(0),
  completedLessons: integer("completed_lessons").notNull().default(0),
  status: enrollmentStatusEnum("status").notNull().default("active"),
  lastAccessedAt: timestamp("last_accessed_at"),
  completedAt: timestamp("completed_at"),
});

// Quiz Attempts
export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  quizId: varchar("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  totalPoints: integer("total_points").notNull(),
  answersSubmitted: jsonb("answers_submitted").notNull(),
  timeTakenSeconds: integer("time_taken_seconds"),
  passed: boolean("passed").notNull(),
  startedAt: timestamp("started_at").notNull(),
  submittedAt: timestamp("submitted_at").notNull(),
});

// Lesson Views
export const lessonViews = pgTable("lesson_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  watchDurationSeconds: integer("watch_duration_seconds").notNull(),
  videoDurationSeconds: integer("video_duration_seconds").notNull(),
  completionPercentage: decimal("completion_percentage", { precision: 5, scale: 2 }).notNull(),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

// Badges
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  badgeType: badgeTypeEnum("badge_type").notNull(),
  criteria: jsonb("criteria").notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Badges Earned
export const badgesEarned = pgTable("badges_earned", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeId: varchar("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Certificates
export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").notNull().references(() => courses.id),
  certificateUrl: text("certificate_url").notNull(),
  verificationCode: text("verification_code").notNull().unique(),
  finalScore: integer("final_score").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
});

// Posts
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postType: postTypeEnum("post_type").notNull(),
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
  isPinned: boolean("is_pinned").notNull().default(false),
  status: contentStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Comments
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => posts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likeCount: integer("like_count").notNull().default(0),
  parentCommentId: varchar("parent_comment_id"),
  status: contentStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Moderation Flags
export const moderationFlags = pgTable("moderation_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flaggedByUserId: varchar("flagged_by_user_id").notNull().references(() => users.id),
  contentType: flagContentTypeEnum("content_type").notNull(),
  contentId: varchar("content_id").notNull(),
  flagReason: flagReasonEnum("flag_reason").notNull(),
  description: text("description"),
  status: flagStatusEnum("status").notNull().default("pending"),
  reviewedByAdminId: varchar("reviewed_by_admin_id").references(() => users.id),
  adminNotes: text("admin_notes"),
  flaggedAt: timestamp("flagged_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Analytics Events
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  eventName: text("event_name").notNull(),
  eventCategory: eventCategoryEnum("event_category").notNull(),
  eventProperties: jsonb("event_properties").default({}),
  sessionId: text("session_id"),
  deviceType: text("device_type"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email().optional(),
  fullName: z.string().min(2).max(100).optional(),
  dateOfBirth: z.string().transform(str => new Date(str)).optional(),
  role: z.enum(["learner", "teacher", "admin"]).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

// Upsert user schema for Replit Auth
export const upsertUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
});

// Complete profile schema for onboarding
export const completeProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["learner", "teacher"]),
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, "Invalid date")
    .refine((dateStr) => {
      const date = new Date(dateStr);
      const today = new Date();
      return date < today;
    }, "Date of birth cannot be in the future")
    .refine((dateStr) => {
      const date = new Date(dateStr);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 100);
      return date > minDate;
    }, "Date of birth must be within the last 100 years"),
  preferences: z.object({
    interests: z.array(z.string()).optional(),
    skillLevel: z.string().optional(),
    learningGoals: z.string().optional(),
    learningStyle: z.string().optional(),
  }).optional(),
});

export const insertTeacherApplicationSchema = createInsertSchema(teacherApplications, {
  expertiseAreas: z.array(z.string()).min(1, "Select at least one area of expertise"),
  teachingExperience: z.string().min(50, "Please provide at least 50 characters about your teaching experience"),
  courseIdeas: z.string().min(50, "Please provide at least 50 characters about your course ideas"),
  bio: z.string().min(100, "Please provide at least 100 characters for your bio"),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
}).omit({ id: true, createdAt: true, updatedAt: true, status: true, reviewedAt: true, reviewNotes: true });

export const insertCourseSchema = createInsertSchema(courses, {
  title: z.string().min(3).max(200),
  description: z.string().max(5000),
  ageGroup: z.enum(["10-13", "14-17", "18-21"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertModuleSchema = createInsertSchema(modules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCourseSessionSchema = createInsertSchema(courseSessions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({ id: true, createdAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true });
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({ id: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBadgeSchema = createInsertSchema(badges).omit({ id: true, createdAt: true });

// Types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type TeacherApplication = typeof teacherApplications.$inferSelect;
export type InsertTeacherApplication = z.infer<typeof insertTeacherApplicationSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type CourseSession = typeof courseSessions.$inferSelect;
export type InsertCourseSession = z.infer<typeof insertCourseSessionSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type EnrollmentWithCourse = Enrollment & { course: Course | null };
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type LessonView = typeof lessonViews.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type BadgeEarned = typeof badgesEarned.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type ModerationFlag = typeof moderationFlags.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
