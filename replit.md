# NDUVA Life Learning Platform

## Overview

NDUVA is an adaptive, gamified learning platform for ages 10-23, focusing on evidence-based learning through reflection and real-world application. It features Vyond-style animated video lessons and AI-powered content creation. The platform provides distinct pathways for learners and teachers, incorporating gamification elements (XP, badges, streaks) designed for motivation without addiction. Key capabilities include AI-assisted course creation for teachers, adaptive course content for learners, community engagement, and full compliance with privacy (COPPA/GDPR) and accessibility (WCAG 2.1 AA) standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

**Technology Stack:** React with TypeScript, Vite, Wouter, TanStack Query, Shadcn/ui, Radix UI.

**Design System:** Hybrid approach inspired by Duolingo, Khan Academy, and Coursera, utilizing Material Design principles. Features a custom color palette with light/dark modes, Inter and Poppins typography, and mobile-first responsive design with Tailwind CSS.

**Key UI Patterns:** Role-based onboarding, card-based course navigation, interactive quiz system, video player with progress tracking, achievement/certificate display, community forum, leaderboard, and dynamic dashboards for learners ("My Learning Dashboard") and teachers ("My Courses").

### Backend

**Technology Stack:** Express.js with TypeScript, PostgreSQL (Neon serverless), Drizzle ORM.

**Architecture Pattern:** Monolithic application with separate client/server directories, a storage abstraction layer, and RESTful API routes.

**Key Features:**
- **Database:** Comprehensive schema with 17+ tables.
- **Authentication:** Replit OAuth integrated with session management (currently using a development-only auto-login as a mock admin user, disabled in production). Multi-role system (`learner`, `teacher`, `admin`) with dynamic UI adaptation.
- **Onboarding:** Multi-step learner onboarding for AI personalization (interests, skill level, learning style, goals) stored in user preferences.
- **Role-Based Access:** Distinct learner and teacher pathways with client-side route protection and dynamic navigation.
- **Course Management:** Full CourseBuilder interface for teachers/admins to create and manage courses, modules, sessions, quizzes (multi-question types), and projects. Includes comprehensive course deletion and publish/unpublish workflows with proper authorization and data cascade.
- **Course Analytics:** Teacher/admin dashboards providing metrics like enrollments, active students, and completion rates.

### Data Architecture

**Database Design:** Includes tables for Users (with parental consent flows), Courses, Modules, Sessions, Quizzes, Attempts, Badges, Certificates, Posts, ModerationFlags, and AnalyticsEvents.

**Planned Features:** Adaptive learning engine, AI-powered content pipeline (prompt to Vyond-style video), advanced gamification (XP, streaks, quests).

### Authentication & Authorization

Currently, a development-only auto-login system provides a mock admin user with all roles. Production will require full Replit OAuth, session management, and token refresh. The system supports multi-role users (`learner`, `teacher`, `admin`) with a clear mechanism for role switching and UI adaptation.

## External Dependencies

### Core Services

- **Database:** Neon PostgreSQL (serverless), Drizzle ORM.
- **Frontend Libraries:** Radix UI, React Hook Form (with Zod), TanStack React Query, Wouter, date-fns, class-variance-authority, clsx.
- **UI Framework:** Tailwind CSS, shadcn/ui.
- **Development Tools:** Vite, TypeScript, ESBuild, Replit-specific plugins.

### Planned External Services

- **AI & Media:** LLM API, Text-to-Speech service, Video rendering service, Embedding/vector database.
- **Infrastructure:** S3/GCS (asset storage), Redis (sessions/job queues), Observability platform, Feature flag system.
- **Authentication:** OAuth providers (Google, Microsoft), Email service.