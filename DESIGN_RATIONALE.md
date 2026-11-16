# Lumora — Intended Users & Design Choices

## The product
**Lumora** is a fictional AI-powered study planner. It turns a course syllabus into a daily study plan, generates flashcards from notes, and offers a focus timer with streaks.

## Intended users
| | Primary audience | Secondary audience |
|---|---|---|
| **Who** | Undergraduate students, aged 18–24 | Self-learners and students preparing for competitive exams |
| **Situation** | Juggling 5–6 courses, labs, part-time jobs and internships | Studying alone without a fixed timetable |
| **Pain points** | Deadlines pile up unseen, so they cram the night before; they don't know what to study today | They lose consistency and motivation |
| **What they need from the page** | To see within 5 seconds that Lumora plans the semester for them, and that it's free to try | To trust the product, through social proof, stats and a clear 3-step flow |

## Design choices

### 1. Page structure follows the decision journey
**Header → Hero → Proof (stats) → Features → How it works → Final CTA → Footer.**
The hero answers *what is it*, the stats answer *can I trust it*, the features answer *what do I get*, the steps answer *how hard is it*, and the dark CTA band asks for the sign-up. There is one primary action ("Start for free" / "Create my study plan"), and it is repeated so it's never far away.

### 2. Colour: warm and energetic, but readable
- **Tangerine `#FF6B3D`** is the brand and action colour. It feels optimistic and youthful, and it stands apart from the blue/purple of most ed-tech products.
- **Ink `#1C1A3D`** (deep navy) is used for text and dark surfaces instead of pure black, which gives softer, premium-looking contrast.
- **Cream `#FFF8F1`** is the page background. It is easier on the eyes than stark white during long study sessions, while cards stay white so they lift off the page.
- **Lilac and teal** are supporting accents. Teal also means "done", and lilac is the illustration backdrop.
- **Accessibility:** primary buttons use **ink text on tangerine** (5.9 : 1) rather than white on tangerine (2.9 : 1, which fails WCAG). Highlighted heading text uses the darker **Ember `#D9480F`** so it meets the large-text contrast ratio on cream. Body text is **Slate `#55536E`** (≈7 : 1).

### 3. Typography: two families, clear hierarchy
- **Space Grotesk** for headings: geometric and slightly quirky, so it reads as tech and student-friendly.
- **Inter** for body and UI text: highly legible at small sizes.
- There are 12 text styles on a defined scale (64 / 44 / 36 / 22 / 20 / 16 / 15 / 14 / 13), with tighter letter-spacing on large headings and an uppercase overline for section labels. Mobile has its own H1/H2 sizes (40 / 30).

### 4. Spacing and layout
- An **8-point spacing scale** (4, 8, 12, 16, 20, 24, 32, 48, 56, 64, 96, 112) is used everywhere.
- Desktop uses a **1200 px content width** with 120 px side padding inside a 1440 frame. Mobile uses a 390 frame with 20 px padding.
- **Auto Layout everywhere:** header, nav, buttons, badge, cards, stats, steps, CTA and footer are all Auto Layout frames, so content can be edited without breaking the layout. Cards use *Fill container*, so the three columns stay equal.

### 5. Components (reusable)
| Component | Why it's a component |
|---|---|
| **Button**, 3 variants: Primary / Secondary / Dark | Used 7× across desktop and mobile; the label is a text property |
| **Feature Card** | Title, description and icon (instance swap) are properties, so all three cards come from one master |
| **Nav Link** | Header links and "Log in" |
| **Badge** | Hero announcement pill |
| **Logo** | Header and footer, desktop and mobile |
| **Icons** (8) | Swappable inside Feature Card; also used in the illustration and mobile menu |
| **Hero Illustration** | One master, reused at 100% on desktop and scaled to 62.5% on mobile |

### 6. Shared styles
- **12 colour styles** (`Brand/…`, `Neutral/…`)
- **12 text styles** (`Display/…`, `Heading/…`, `Mobile/…`, `Body/…`, `Label/…`)
- **2 effect styles** (`Shadow/Card`, `Shadow/Float`)

Every fill, stroke, shadow and text layer in the file uses these styles. There are no hard-coded values.

### 7. Hero illustration instead of stock photos
Rather than a stock photo, the hero shows a **product preview**: a "Today's plan" card with a progress ring, tasks, a streak chip and an AI tip. It shows what the product does, it is built only from the design system, and it stays sharp at any size.

### 8. Responsive behaviour
| Breakpoint | Change |
|---|---|
| ≥ 1201 px | Two-column hero, 3-column cards and steps, full navigation |
| ≤ 1200 px | Hero stacks; illustration is centred |
| ≤ 900 px | Navigation collapses into a hamburger menu; cards and steps become one column; stats go 2 × 2 |
| ≤ 640 px | Mobile type scale, full-width buttons, illustration scaled to 62.5% |
