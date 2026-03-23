# Project Information & AI Guidelines

This file serves as a comprehensive guide to the project's architecture, dependencies, coding standards, and folder structure. It is intended to help future AI assistants understand the project context instantly without scanning the entire codebase.

## 1. Tech Stack & Dependencies

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`
- **UI Components**: Shadcn UI (Radix UI base), `lucide-react` for icons
- **Animations & 3D**: `motion` (Framer Motion), `gsap`, `three`, `ogl`, `@paper-design/shaders`
- **Scrolling**: `lenis` (for smooth scrolling)
- **CMS**: Sanity.io (configured in `src/sanity/`)
- **State Management**: `zustand`
- **Forms**: `react-hook-form`, `zod`
- **Other**: `sonner` (toasts), `@emailjs/browser`

## 2. Folder Structure

The project uses the `src` directory configuration.

```text
src/
├── app/                  # Next.js App Router (pages, layouts, routing)
│   ├── (home)/           # Route group for the main landing page
│   ├── projects/         # Dynamic routes for projects (e.g., [id])
│   └── studio/           # Sanity Studio route
├── components/           # React Components
│   ├── animations/       # Complex interactive/animated UI blocks (e.g., ColorBends, MagicBento)
│   ├── common/           # Generic reusable components (e.g., HorizontalLine)
│   ├── layout/           # Structural components (e.g., footer, back-button)
│   ├── providers/        # Context providers (e.g., ThemeProvider)
│   └── ui/               # Shadcn UI primitives and base components
├── hooks/                # Custom React hooks (e.g., useIsMobile)
├── lib/                  # Utility functions (e.g., utils.ts for cn())
├── sanity/               # Sanity CMS configuration and schemas
├── store/                # Zustand global state stores
└── types/                # TypeScript type definitions and interfaces
```

## 3. Coding Style & Conventions

- **Component Architecture**: 
  - Prefer functional components with React Server Components (RSC) by default.
  - Add `'use client'` directive *only* when utilizing hooks (useState, useEffect), browser APIs, or interactive animations (Framer Motion, GSAP, Lenis).
- **Import Paths**: 
  - Always use absolute imports mapped via `@/*` (e.g., `import { cn } from "@/lib/utils"`).
- **Styling**:
  - Use Tailwind CSS utility classes.
  - When dynamically combining classes, use the `cn()` utility (`clsx` + `tailwind-merge`) found in `@/lib/utils`.
- **Props & Typing**:
  - Export component prop types/interfaces explicitly.
  - Interface naming should generally be descriptive (e.g., `ComponentNameProps`).
- **Animations**:
  - Encapsulate heavy animations (WebGL, GSAP, framer-motion) in client-side components within `src/components/animations/` and import them dynamically (`next/dynamic`) where necessary to maintain performance.

## 4. Workflows for AI Agents

- **Creating UI Components**: When asked to add a new generic UI primitive, place it in `src/components/ui/`. If it's a layout piece, place it in `src/components/layout/`. If it features heavy animations/WebGL, place it in `src/components/animations/`.
- **Editing Styling**: Apply classes using Tailwind CSS. Do not write custom CSS unless strictly necessary (in `src/app/globals.css`).
- **Fetching Data**: Fetch CMS content using Sanity queries on the Server side where possible to optimize SEO and Initial Page Load. Pass the fetched data as props to Client Components.
- **Before Modifying Configurations**: Check `tailwind.config.ts`, `next.config.ts`, and `eslint.config.mjs` to ensure alignment with existing Next.js 16 and Tailwind v4 setups.

---
*Note: Always use `npm run build` or `npx tsc --noEmit` to verify type safety and import path correctness after massive refactoring or code additions.*