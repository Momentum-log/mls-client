# Copilot Instructions for GitHub Copilot for this project: Momentum Logistics Service

## About the Project

Momentum Logistics Service is a comprehensive logistics management system designed to streamline and optimize the
operations of logistics companies. The system provides features such as shipment tracking, inventory management, route
optimization, and real-time analytics.

## Technologies Used

- Backend: Node.js, Express.js
- Frontend: React.js, Next.js
- Database: PostgreSQL

## Coding Standards

- Follow JavaScript ES6+ standards.
- Use meaningful variable and function names.
- Write modular and reusable code.
- Include comments and documentation for complex logic.
- Adhere to RESTful API design principles for backend development.
- For local modules, always use the alias `@/` to import them.

## Workflows

- For new features, make sure it's on a new branch (not `main`) and name it according to the feature being implemented.
- Start by creating a detailed plan or outline of the feature.
- Break down the feature into smaller tasks or components.
- **After implementing a feature, run all code quality checks:**
  1.  First, run the TypeScript compiler check: `bunx tsc --noEmit`
  2.  Then, run ESLint checks to ensure code quality.
- **Only after all checks pass:** Update `changelog.md` with a summary of changes made, using the following format:
  ```
  ### [version code: 1.0.0] - YYYY-MM-DD - Short description of changes
  - Then list of changes:
  - Added: New feature or functionality
  - Changed: Updates to existing features
  - Fixed: Bug fixes
  - Removed: Deprecated features
  - **Some can be in big details**: Like this one
      - Sub-detail of the change
  ```
- Always check if the server is running before deciding to start the server again.

## 1. Design & Styling Philosophy (Strict)

- **Design Style:** All new components and pages MUST follow a **flat, minimalist, and modern** design.
  - **NO GRADIENTS.** Use solid colors only.
  - Keep designs simple, clean, and without exaggeration.
- **Color Usage (Mandatory):**
  - **DO NOT** use raw Tailwind color classes (e.g., `text-green-500`, `bg-yellow-300`, `text-white`).
  - **ALL** colors MUST be applied using the custom CSS variables defined in `global.css`.
  - **Examples:** Use `bg-brand-blue`, `text-brand-yellow`, `bg-background-color`, `text-text-color`.
  - If a new color is needed, it should be added to `global.css` first.
- **Visual Hierarchy & Contrast:**
  - You MUST ensure proper contrast ratios.
  - If a background is dark (e.g., `bg-brand-blue`), text on top MUST be a light, high-contrast color (e.g., `text-text-color` if it's light, or a specific light variable).
  - If a background is light, text MUST be dark. Maintain this legibility and hierarchy across the entire application.

## 2. Component & Layout Awareness (Strict)

- **Read First:** Before generating _any_ new code, you must read the existing project files to understand the established patterns.
- **Check for Reusable Components:**
  - **DO NOT** write new blocks of Tailwind classes for common UI patterns (like page containers, buttons, or cards).
  - **FIRST, ALWAYS** check the `components/` directory (especially `components/ui/`) for an existing reusable component that achieves the same goal.
  - **Example:** Instead of adding `div className="max-w-7xl mx-auto px-4"` to a page, check if a `<Container>` component exists and use that instead.
  - **Example:** Instead of styling a new `<button>`, use the existing `<Button>` component from the UI library.
  - Only create a new component if no reusable equivalent exists.
- **Check for Global Layout:**
  - Be aware of components in the global `layout.tsx` file (like a main `Header` or `Navbar`).
  - **DO NOT** add a `Header` to a new page if one is already provided by the global layout, as this will cause duplication.
  - Generate only the unique content for that specific page.

## 3. General Code Style

- Use Tailwind CSS for all styling (following the strict rules in section 1).
- Ensure responsiveness across all devices.
- Use Flexbox and Grid for layouts.
- Maintain consistent spacing, padding, and margins using Tailwind's utility classes.
- Use Tailwind's typography utilities for text styling.
- Avoid inline styles; prefer Tailwind classes.
