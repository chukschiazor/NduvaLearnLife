# NDUVA Life Learning Platform

## Overview

NDUVA is an adaptive, gamified learning platform designed for ages 10-21 (extending to 23 based on profile data). The platform combines Vyond-style animated video lessons with AI-powered content creation, project-based learning, and community engagement. It emphasizes evidence-based learning through reflection and real-world application, while maintaining privacy compliance (COPPA/GDPR) and accessible design (WCAG 2.1 AA).

The application provides distinct pathways for learners and teachers, with learners progressing through adaptive course content while teachers leverage AI tools to create and publish courses quickly. The platform features gamification elements (XP, badges, streaks) designed to motivate without creating addictive patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for server state management
- Shadcn/ui components with Radix UI primitives for accessible UI elements

**Design System:**
- Hybrid approach inspired by Duolingo's gamification, Khan Academy's clarity, and Coursera's structure
- Material Design principles for consistency
- Custom color palette with light/dark mode support
- Typography: Inter (body) and Poppins (headings) from Google Fonts
- Mobile-first responsive design with Tailwind CSS
- Theme configuration supporting CSS variables for dynamic theming

**Key UI Patterns:**
- Role-based onboarding flow (learner vs. teacher)
- Card-based course navigation with progress tracking
- Interactive quiz system with immediate feedback
- Video player with progress tracking and completion marking
- Achievement and certificate display system
- Community forum with discussion threads
- Leaderboard with daily/weekly/all-time rankings

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- PostgreSQL database via Neon serverless (with WebSocket support)
- Drizzle ORM for type-safe database operations
- Session-based authentication (infrastructure in place for OAuth integration)

**Architecture Pattern:**
- Monolithic application with separate client/server directories
- Storage abstraction layer (currently using in-memory storage, designed for database integration)
- API routes prefixed with `/api` for clear separation from static assets
- Middleware for request logging and error handling

**Current State (Phase 1 MVP - Foundation Complete):**
- **Database**: Complete schema with 15+ tables deployed to PostgreSQL
- **Authentication**: Replit OAuth fully integrated with session management
- **Storage Layer**: DatabaseStorage implementation with CRUD operations for all entities
- **API Routes**: RESTful endpoints for auth, courses, enrollments, gamification, and community
- **Frontend Auth**: useAuth hook, landing page, and onboarding flow
- **Development**: HMR via Vite, TypeScript type safety throughout

### Data Architecture

**Database Design (Defined in Architecture):**
- Users (with parental consent flows for under-13)
- Courses and Lessons with adaptive difficulty levels
- Quizzes and Attempts with detailed analytics
- Badges and Certificates for gamification
- Posts and ModerationFlags for community safety
- AnalyticsEvents for tracking learning patterns

**Planned Features:**
- Adaptive learning engine using quiz history, engagement metrics, reflection quality, pace, and confidence checks
- Content pipeline: Prompt → Script → Storyboard → Vyond-style scenes → TTS → captions
- Gamification: XP system, badges, streaks, weekly quests with healthy motivation patterns

### Authentication & Authorization

**Implementation (✓ Complete):**
- Replit OAuth integration (Google, GitHub, X, Apple, email/password)
- Session-based authentication with PostgreSQL session store (connect-pg-simple)
- 7-day session TTL with automatic token refresh
- Protected API routes using isAuthenticated middleware
- Role-based onboarding flow (learner vs. teacher selection)

**Auth Flow:**
1. Landing page with "Start Learning" CTA for unauthenticated users
2. OAuth login via /api/login → Replit OIDC flow
3. Callback to /api/callback creates user session and upserts user
4. First-time users complete onboarding (role selection + date of birth)
5. Authenticated users access full app with role-based features

**User Schema (Merged Replit Auth + Platform Fields):**
- OAuth fields: id (sub), email, firstName, lastName, profileImageUrl
- Platform fields: role, dateOfBirth, xpPoints, currentStreak, fullName
- Computed fullName from firstName + lastName for display

**Privacy & Compliance (Planned):**
- Parental consent workflow for users under 13 (COPPA)
- Privacy by design approach
- GDPR compliance requirements  
- Data retention policies
- Moderated community with automated filters

### AI & Content Pipeline

**Planned Integrations:**
- LLM service for AI-powered content generation
- Text-to-Speech (TTS) for voice synthesis
- Video rendering for Vyond-style animations
- Embedding service for semantic search and content retrieval
- Safety rules and moderation filters for community content

**Teacher Tools:**
- AI-assisted course creation
- Quick publish workflow
- Content storyboarding interface

## External Dependencies

### Core Services

**Database:**
- Neon PostgreSQL serverless database
- WebSocket constructor for serverless connections
- Drizzle ORM for schema management and queries

**Frontend Libraries:**
- Radix UI primitives for accessible components (accordion, dialog, dropdown, tabs, toast, etc.)
- React Hook Form with Zod resolvers for form validation
- TanStack React Query for data fetching and caching
- Wouter for routing
- date-fns for date manipulation
- class-variance-authority and clsx for styling utilities

**UI Framework:**
- Tailwind CSS for utility-first styling
- Custom design tokens via CSS variables
- shadcn/ui component library (New York style variant)

**Development Tools:**
- Vite for build tooling and dev server
- TypeScript for type safety
- ESBuild for production builds
- Replit-specific plugins (dev banner, cartographer, runtime error overlay)

### Planned External Services

**AI & Media (from architecture documents):**
- LLM API for content generation
- Text-to-Speech service
- Video rendering service for animations
- Embedding/vector database for semantic search

**Infrastructure:**
- S3/GCS for asset storage
- Redis for sessions and job queues
- Observability platform for logs, traces, and metrics
- Feature flag system for A/B testing

**Authentication:**
- OAuth providers (Google, Microsoft, etc.)
- Email service for notifications

### Asset Management

- Static assets stored in `attached_assets/` directory
- Generated images for course thumbnails (budgeting, creativity, problem-solving, investing modules)
- Logo assets (light/dark variants)
- Vite alias configuration for easy asset imports (`@assets`)