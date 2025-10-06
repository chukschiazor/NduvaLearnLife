# NDUVA Life Learning Platform - Design Guidelines

## Design Approach

**Hybrid Approach:** Educational Platform Design System inspired by Duolingo's gamification, Khan Academy's clarity, and Coursera's structured learning, with Material Design principles for consistency.

**Core Philosophy:** Youthful and energetic without being childish, accessible for 10-year-olds yet sophisticated enough for 23-year-olds. Emphasis on motivation through visual feedback, progress celebration, and achievement recognition.

---

## Color Palette

### Light Mode
- **Primary Brand:** 245 82% 58% (Vibrant purple-blue, energetic and educational)
- **Primary Hover:** 245 82% 52%
- **Secondary:** 340 75% 55% (Accent pink for achievements/celebrations)
- **Success:** 142 71% 45% (Quiz correct answers, completion)
- **Warning:** 38 92% 50% (Streaks, attention items)
- **Error:** 0 72% 51% (Quiz incorrect answers)
- **Background:** 240 20% 99%
- **Surface:** 0 0% 100%
- **Text Primary:** 240 10% 10%
- **Text Secondary:** 240 5% 40%

### Dark Mode
- **Primary Brand:** 245 70% 65%
- **Background:** 240 15% 10%
- **Surface:** 240 12% 15%
- **Text Primary:** 240 5% 95%
- **Text Secondary:** 240 5% 70%

---

## Typography

**Primary Font:** Inter (Google Fonts) - Clean, highly legible for educational content
**Display Font:** Poppins (Google Fonts) - Friendly and approachable for headings

**Scale:**
- Hero/Display: text-5xl md:text-6xl, font-bold (Poppins)
- Page Headers: text-3xl md:text-4xl, font-semibold (Poppins)
- Section Headers: text-2xl font-semibold (Poppins)
- Card Titles: text-lg font-semibold (Inter)
- Body: text-base (Inter)
- Small/Meta: text-sm (Inter)

---

## Layout System

**Spacing Units:** Tailwind spacing of 3, 4, 6, 8, 12, 16, 20, 24
- Tight spacing: p-3, gap-3
- Standard spacing: p-6, gap-6, py-8
- Section spacing: py-12, py-16, py-20
- Large breathing room: py-24

**Container Strategy:**
- Max width: max-w-7xl for main content
- Max width: max-w-4xl for video players and focused content
- Full width: Dashboard grids and admin panels

---

## Component Library

### Navigation
**Student Navigation:**
- Sticky top navbar with logo left, nav items center (My Courses, Leaderboard, Forum, Profile)
- Progress indicator bar beneath (showing overall completion %)
- Mobile: Hamburger menu with slide-out drawer

**Admin Navigation:**
- Sidebar navigation (fixed left, w-64) with icons + labels
- Dashboard, Content Management, Students, Analytics, Settings sections
- Collapsible on mobile

### Video Player Interface
- Custom styled player controls with brand colors
- Large thumbnail preview with play overlay
- Progress bar at bottom showing watched portions (primary color)
- Related lessons sidebar (right rail on desktop)
- Save progress indicator (auto-saves every 10 seconds)
- "Mark Complete" button prominent after 90% watched

### Quiz Components
- **Question Cards:** Large, rounded-2xl cards with shadow-lg
- Multiple choice: Grid of answer buttons (2x2 for 4 options)
- Instant feedback: Green border + checkmark for correct, red shake animation for incorrect
- Progress dots at top showing question X of Y
- Timer badge (top right) if timed quiz
- **Results Screen:** Confetti animation (canvas-confetti library), score circle graphic, breakdown of correct/incorrect, retry button

### Progress Dashboard
- **Hero Stats Section:** 3-column grid showing Total Lessons Completed, Quiz Average Score, Current Streak (days)
- **Progress Cards:** Course module cards with circular progress indicators, last watched timestamp, continue button
- **Achievement Badges:** Earned badges displayed as icons (first quiz, perfect score, 7-day streak, etc.)
- **Certificate Display:** PDF preview with download button for completed modules

### Leaderboard
- **Tab Navigation:** Daily, Weekly, All-Time tabs
- **Table Layout:** Rank (medal icons for top 3), Avatar, Name, Score, Lessons Completed
- **Current User Highlight:** Sticky positioned, background accent, scroll to view
- **Filter Options:** By age group (10-15, 16-19, 20-23)

### Discussion Forum
- **Thread List:** Card-based with user avatar, title, preview text, reply count, last activity
- **Thread View:** Nested comments (max 2 levels), upvote system, moderation flags
- **New Post:** Modal with rich text editor (Tiptap or similar)

### Admin Dashboard
- **Analytics Cards:** Grid layout showing active users, videos uploaded, average quiz score, completion rate
- **Content Upload:** Drag-drop zone for videos, form for quiz creation (add questions dynamically)
- **Student Management Table:** Sortable, filterable, with action buttons (view profile, reset progress, send message)

### Forms & Inputs
- All inputs: rounded-lg, border-2, focus:ring-4 focus:ring-primary/20
- Labels: text-sm font-medium mb-2
- Dark mode: Maintain border visibility with lighter borders
- Buttons: rounded-lg, px-6 py-3, font-semibold, shadow-sm hover:shadow-md transition

---

## Images

### Hero Section (Homepage)
**Large Hero Image:** Animated illustration showing diverse students learning (laptops, books, lightbulbs) - bright, colorful, optimistic aesthetic similar to Vyond animation style
- Placement: Right 50% of hero on desktop, background on mobile
- Overlay: Semi-transparent gradient from left

### Module/Course Cards
**Thumbnail Images:** Custom illustrations representing each life skill module (piggy bank for budgeting, lightbulb for creativity, puzzle for problem-solving)
- Size: 16:9 aspect ratio, rounded-xl

### Achievement/Certificate Graphics
**Badge Icons:** Colorful vector graphics (trophy, star, medal) from Heroicons or custom
**Certificate Template:** Formal border design with NDUVA logo, student name, course title, completion date

---

## Animations

**Minimal, Purposeful Motion:**
- Quiz feedback: 0.3s shake for incorrect, 0.4s scale pulse for correct
- Achievement unlock: Single confetti burst
- Page transitions: 0.2s fade
- Progress bars: 1s smooth fill animation
- Button hovers: 0.15s scale and shadow
- NO continuous animations, parallax, or decorative motion

---

## Key Design Principles

1. **Motivation-Driven:** Visual celebration of progress (badges, streaks, completion animations)
2. **Age-Appropriate Flexibility:** Sophisticated enough to avoid feeling "kiddie" for older students
3. **Clarity Over Decoration:** Information hierarchy ensures students always know what to do next
4. **Mobile-First Interaction:** Touch targets minimum 44px, thumb-friendly navigation
5. **Accessibility:** WCAG AA contrast ratios, keyboard navigation, screen reader support
6. **Gamification Balance:** Encouraging without being overwhelming or anxiety-inducing