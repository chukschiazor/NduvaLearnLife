# NDUVA Life Learning Platform - Design Guidelines

## Design Approach

**Organic Growth Aesthetic:** Inspired by the Smart Club design system - combining natural, organic elements with modern, clean interfaces. Think "Friendly Tech" - professional enough for 23-year-olds, playful enough for 10-year-olds.

**Core Philosophy:** Growth-focused design using plant/nature metaphors, soft 3D elements, generous white space, and a unified design system that works across all ages (10-23). Clean, breathable layouts with personality through subtle animations and the Nova mascot.

**Visual References:**
- Smart Club: Organic aesthetic, soft shadows, 3D depth, plant iconography
- Spotify: Clean, modern, confident interface
- Duolingo: Gamification without overwhelming users
- Notion: Professional yet approachable

---

## Color Palette

### Primary Colors

**Electric Green (Growth & Energy)**
- Primary: `142 76% 48%` - #10B981 (Emerald green, vibrant and fresh)
- Primary Hover: `142 76% 42%` - Darker for interactions
- Usage: Primary CTAs, XP gains, progress bars, achievement highlights, active states

**Deep Navy (Confidence & Trust)**
- Primary Text: `220 40% 15%` - #1A2332 (Deep navy, professional)
- Headers: `220 40% 18%` - Slightly lighter for headings
- Usage: Main text, headers, navigation background, primary buttons (alternative)

**Slate Gray (Secondary & Subtle)**
- Secondary Text: `215 16% 47%` - #64748B
- Borders: `215 20% 65%` - Lighter for borders
- Disabled: `215 14% 71%` - Muted for inactive states
- Usage: Secondary text, borders, inactive elements, subtle backgrounds

### Background Colors

**Warm Neutrals (Organic Feel)**
- Background: `40 30% 94%` - #F5F3EE (Warm beige, like Smart Club)
- Surface (Cards): `0 0% 100%` - Pure white for cards
- Subtle Tint: `40 20% 97%` - Very light beige for sections
- Usage: Page backgrounds, card surfaces, soft containers

### Accent Colors

**Success (Quiz Correct, Completion)**
- Success: `142 71% 45%` - Matches primary green
- Success Light: `142 71% 90%` - For backgrounds

**Warning (Streaks, Attention)**
- Warning: `38 92% 50%` - Vibrant orange
- Warning Light: `38 92% 90%` - For backgrounds

**Error (Quiz Incorrect)**
- Error: `0 72% 51%` - Bright red
- Error Light: `0 72% 90%` - For backgrounds

### Dark Mode (Optional - Future Implementation)
- Background: `220 40% 10%` - Deep navy background
- Surface: `220 35% 14%` - Slightly lighter cards
- Text Primary: `220 10% 95%` - Off-white
- Primary: `142 70% 55%` - Lighter green for contrast

---

## Typography

**Primary Font:** Inter (Google Fonts) - Clean, highly legible, modern sans-serif
**Display Font:** Poppins (Google Fonts) - Friendly yet sharp for headings

### Font Scale

**Headings (Poppins):**
- Hero/Display: text-5xl md:text-6xl lg:text-7xl, font-bold
- Page Headers (H1): text-4xl md:text-5xl, font-bold
- Section Headers (H2): text-3xl font-semibold
- Subsection (H3): text-2xl font-semibold
- Card Titles (H4): text-xl font-semibold

**Body (Inter):**
- Large Body: text-lg (for landing page, important content)
- Default Body: text-base
- Small Text: text-sm
- Tiny Text: text-xs (metadata, timestamps)

**Font Weights:**
- Regular: 400 (body text)
- Medium: 500 (labels, emphasized text)
- Semibold: 600 (card titles, navigation)
- Bold: 700 (headings, CTAs)

---

## Layout System

### Spacing Scale
**Consistent spacing using Tailwind's 4px base:**
- Micro: gap-2 (8px) - Tight elements like badge groups
- Small: gap-3, p-3 (12px) - Form elements, list items
- Default: gap-4, p-4 (16px) - Card padding, general spacing
- Medium: gap-6, p-6 (24px) - Card internal padding
- Large: gap-8, p-8 (32px) - Section spacing
- XL: gap-12, py-12 (48px) - Major section divisions
- 2XL: gap-16, py-16 (64px) - Hero sections
- 3XL: py-24 (96px) - Landing page sections

### Container Strategy
- Page Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Content Container: `max-w-4xl mx-auto` - For articles, video players
- Narrow Container: `max-w-2xl mx-auto` - For forms, onboarding
- Full Width: Dashboards, admin panels with sidebars

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (sm - lg)
- Desktop: > 1024px (lg)
- Wide: > 1280px (xl)

---

## Component Library

### Nova Mascot 🌱
**The Growth Guide Character:**
- Design: Minimalist leaf/plant icon in a circle (inspired by Smart Club plant icon)
- Style: Simple geometric leaf shape, friendly and approachable
- Colors: Deep navy leaf on electric green circle, or vice versa
- Usage: Onboarding guide, empty states, achievement celebrations, helpful tips
- Expressions: 2-3 variants (happy, excited, thoughtful)
- Animation: Subtle bounce-in, gentle wave, celebrate bounce

**Where Nova Appears:**
- Onboarding flow (welcoming new users)
- Empty states ("No courses yet? Let me help!")
- Achievement unlocks (celebrating with user)
- Tooltips and hints (providing guidance)
- 404/Error pages (friendly assistance)

### Navigation

**Desktop Top Navigation (Icon + Text):**
- Background: Deep Navy (`bg-[#1A2332]`)
- Height: 64px (h-16)
- Logo: Left side with NDUVA wordmark
- Nav Items: Center-aligned with icons + text
  - 🏠 Home
  - 📚 My Courses
  - 🏆 Leaderboard
  - 💬 Forum
- Profile: Right side with avatar + dropdown
- Sticky positioning on scroll

**Mobile Bottom Navigation (Icon + Label):**
- Background: White with shadow-lg
- Height: 64px safe-area-inset-bottom
- Items: 5 icons evenly spaced
- Active state: Electric green icon + text
- Fixed bottom positioning

### Cards & Surfaces

**Primary Card Style (Smart Club Inspired):**
- Background: Pure white
- Border Radius: rounded-2xl (16px)
- Shadow: shadow-lg with subtle warm tint
- Padding: p-6 (24px) interior
- Border: None (shadow provides separation)
- Hover: Transform scale-[1.02], shadow-xl

**Course Cards:**
- Aspect Ratio: 16:9 thumbnail
- Content: Title, description, progress bar, continue button
- Status Indicator: Electric green vertical bar on left edge if active
- Duration/XP: Badge overlays on thumbnail

**Stat Cards (Dashboard):**
- Icon + Number + Label
- Icon: Electric green or navy background circle
- Number: Large, bold (text-4xl)
- Label: Secondary text
- Grid Layout: 3 columns on desktop, 1 on mobile

### Buttons

**Primary Button (Electric Green):**
```
bg-primary text-white px-6 py-3 rounded-xl font-semibold
hover:shadow-lg transition-all
```

**Secondary Button (Deep Navy):**
```
bg-[#1A2332] text-white px-6 py-3 rounded-xl font-semibold
hover:shadow-lg transition-all
```

**Outline Button:**
```
border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold
hover:bg-primary hover:text-white transition-all
```

**Icon Button:**
```
p-3 rounded-lg hover:bg-gray-100 transition-colors
```

### Forms & Inputs

**Text Inputs (Smart Club Style):**
- Background: White or very light gray
- Border: 2px border-gray-200
- Rounded: rounded-xl (larger than default)
- Padding: px-4 py-3
- Focus: border-primary ring-4 ring-primary/10
- Labels: text-sm font-medium mb-2
- Error State: border-error ring-error/10

**Styled Checkbox/Radio:**
- Custom styling with electric green accent
- Large touch target (min 44px)
- Clear visual feedback

### Progress Indicators

**Circular Progress (Apple Watch Style):**
- Size: 64px - 120px diameter
- Stroke: Electric green on gray background
- Percentage: Centered, bold
- Usage: Course completion, skill mastery

**Linear Progress Bar:**
- Height: 8px (h-2) default, 12px (h-3) for emphasis
- Rounded: rounded-full
- Background: gray-200
- Fill: Electric green with smooth animation
- Usage: Lesson progress, quiz timer

**Streak Counter:**
- Icon: 🔥 Fire emoji or custom flame
- Number: Large, bold, orange/warning color
- Label: "day streak"
- Placement: Dashboard widget or profile

### Gamification Elements

**XP Notification (Floating):**
- Small card that appears on action completion
- "+10 XP!" in electric green
- Fade in from bottom, float up, fade out
- Duration: 2 seconds
- Animation: cubic-bezier easing

**Badge Display:**
- Grid of earned badges
- Locked badges: Grayscale with lock icon
- Unlocked: Full color with shine effect
- Click: Shows badge details modal
- Categories: Achievement, Milestone, Special

**Leaderboard Table:**
- Rank column with medal icons (🥇🥈🥉) for top 3
- Avatar column
- Name column
- Score/XP column (electric green)
- Highlight: Current user row with subtle green background
- Tabs: Daily, Weekly, All-Time

---

## Decorative Elements (Smart Club Inspired)

### 3D Spheres
- Subtle gradient spheres in corners/backgrounds
- Colors: Soft beige, sage green tints
- Size: Various (small accent to large background)
- Opacity: 10-30%
- Usage: Landing page, empty states, backgrounds

### Leaf Graphics
- Simple, geometric leaf shapes
- Colors: Electric green, sage green, deep navy
- Usage: Decorative accents, section dividers
- Style: Flat with subtle shadow or gradient

### Dot Grid Patterns
- Small dot patterns for texture
- Opacity: 5-10%
- Usage: Card backgrounds, section backgrounds
- Spacing: Regular grid (24px)

---

## Images & Media

### Hero Images
- Style: Illustrated, friendly, diverse representation
- Color Palette: Matches brand (greens, navy, warm neutrals)
- Placement: Right 50% on desktop, background on mobile
- Overlay: Gradient fade from left (for text readability)

### Course Thumbnails
- Aspect Ratio: 16:9
- Style: Illustrated icons/graphics matching module theme
- Background: Soft gradients or solid colors
- Size: Minimum 800x450px for quality

### Avatar/Profile Images
- Shape: Circular (rounded-full)
- Sizes: Small (32px), Medium (48px), Large (96px), XL (128px)
- Fallback: Initials on electric green background
- Border: Optional 2px white border with shadow

---

## Animations & Micro-interactions

**Guiding Principles:**
- Purposeful, not decorative
- Quick and snappy (150-300ms)
- Respect prefers-reduced-motion
- Reinforce user actions

**Animation Types:**

**Button Hover:**
- Scale: scale-[1.02]
- Shadow: shadow-sm → shadow-lg
- Duration: 150ms
- Easing: ease-in-out

**Page Transitions:**
- Fade: opacity 0 → 1
- Duration: 200ms
- Easing: ease-out

**Success Feedback:**
- Checkmark: Scale pulse (0.9 → 1.1 → 1)
- Duration: 400ms
- Color: Success green

**Error Feedback:**
- Shake: translateX(-10px → 10px → 0)
- Duration: 300ms
- Easing: ease-in-out

**Achievement Unlock:**
- Modal: Slide up from bottom
- Confetti: Single burst (canvas-confetti)
- Badge: Scale in with bounce
- Duration: 500ms total

**Nova Animations:**
- Entry: Bounce in from bottom
- Wave: Gentle rotation (±5deg)
- Celebrate: Jump up and down
- All: 300-500ms duration

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on Background: Minimum 4.5:1
- Large Text (18pt+): Minimum 3:1
- Electric Green on White: ✓ Passes
- Deep Navy on White: ✓ Passes
- All CTAs: Tested and passing

**Keyboard Navigation:**
- All interactive elements: focusable
- Focus indicators: 2px outline in primary color
- Tab order: Logical and intuitive
- Skip links: Skip to main content

**Screen Readers:**
- All images: Descriptive alt text
- Icons: aria-label when standalone
- Form inputs: Proper label associations
- Nova mascot: Decorative, aria-hidden

**Touch Targets:**
- Minimum size: 44x44px
- Spacing: 8px between targets
- Mobile-first: Designed for thumb zones

---

## Key Design Principles

1. **Growth Metaphor:** Nature-inspired visuals reinforce learning as organic growth
2. **Unified for All Ages:** One clean design works for 10-year-olds and 23-year-olds
3. **Breathable Layouts:** Generous white space prevents cognitive overload
4. **Instant Feedback:** Visual confirmation of every user action
5. **Personality Through Subtlety:** Nova mascot and decorative elements add charm without clutter
6. **Mobile-First:** Touch-friendly, thumb-zone optimized
7. **Purposeful Motion:** Animations enhance understanding, never distract
8. **Accessible by Default:** Design for everyone from the start
