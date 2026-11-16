# Lumora — Responsive Product Landing Page (UI/UX · Figma)

A landing page for **Lumora**, a fictional AI study planner for college students. It was designed with Figma **Auto Layout**, **reusable components** and **shared colour and text styles**, and built as a responsive website.

> **Task:** Create a responsive product landing page — header (logo, nav, CTA), hero (heading, description, illustration, primary button), at least three feature cards and a footer, with Auto Layout and consistent typography, spacing and colour.

![Desktop design](screenshots/desktop.png)

## What's in this repo

| Path | What it is |
|---|---|
| [`figma-plugin/`](figma-plugin) | A Figma plugin that **generates the full design file**: styles, components, a design-system sheet, and desktop + mobile frames |
| [`docs/`](docs) | The responsive HTML/CSS version of the design (served with GitHub Pages) |
| [`DESIGN_RATIONALE.md`](DESIGN_RATIONALE.md) | Intended users and design choices |
| [`screenshots/`](screenshots) | Desktop, tablet and mobile renders |
| [`tools/mock-figma-test.js`](tools/mock-figma-test.js) | A smoke test that runs the plugin against a mock Figma API |

## Deliverables checklist

- ✅ **One complete landing-page design**: Desktop 1440 and Mobile 390 frames
- ✅ **At least three reusable components**: Button (3 variants), Feature Card, Nav Link, Badge, Logo, Icons (8), Hero Illustration
- ✅ **Shared colour and typography styles**: 12 colour styles, 12 text styles and 2 effect styles
- ✅ **Auto Layout** on the header, nav, buttons, cards, stats, steps, CTA, footer and every content section
- ✅ **Explanation of users and design choices**: see [DESIGN_RATIONALE.md](DESIGN_RATIONALE.md)

## Open the design in Figma (one-click generate)

1. Download this repo (**Code → Download ZIP**) and unzip it.
2. Open the **Figma desktop app** and create a new design file.
3. Go to **Menu → Plugins → Development → Import plugin from manifest…** and choose `figma-plugin/manifest.json`.
4. Run **Plugins → Development → Lumora Landing Page Generator**.

In a few seconds the page fills with:
- **Lumora — Design System**: colour swatches, the type scale, shadows and all component masters
- **Lumora — Desktop 1440**: the full landing page
- **Lumora — Mobile 390**: the responsive mobile layout

All styles appear in the right-hand panel (Local styles), and all components appear in the Assets panel.

## Design system at a glance

**Colours**

| Style | Hex | Use |
|---|---|---|
| Brand/Tangerine | `#FF6B3D` | Primary buttons, highlights |
| Brand/Ember | `#D9480F` | Accent text |
| Brand/Ink | `#1C1A3D` | Headings, dark surfaces |
| Brand/Lilac | `#E8E4FF` | Illustration backdrop, icon tiles |
| Brand/Teal | `#0E9F8E` | Success states |
| Neutral/Cream | `#FFF8F1` | Page background |
| Neutral/Slate | `#55536E` | Body text |
| Neutral/Line | `#ECE4D9` | Borders |

**Typography:** Space Grotesk (headings) + Inter (body and UI)

| Style | Size / Line height |
|---|---|
| Display/H1 | 64 / 72 Bold |
| Heading/H2 | 44 / 52 Bold |
| Heading/H3 | 22 / 30 SemiBold |
| Body/Large | 20 / 32 Regular |
| Body/Regular | 16 / 26 Regular |
| Label/Button | 16 / 24 SemiBold |
| Label/Overline | 13 / 16 Bold, uppercase |

## Responsive views

| Tablet (834) | Mobile (390) |
|---|---|
| <img src="screenshots/tablet.png" width="360"> | <img src="screenshots/mobile.png" width="220"> |

## Run the website locally
Open `docs/index.html` in any browser. It has no build step and no dependencies.

---
*Lumora is a fictional product created for a UI/UX course assignment.*
