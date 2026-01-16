## Relevant Files

- `app/app/shipments/new/page.tsx` - Main entry point for the new stacked shipment creation flow.
- `app/app/shipments/new/layout.tsx` - Layout wrapper for the shipment creation process.
- `components/shipment/vertical-timeline.tsx` - [NEW] Component for the left-side progress indicator.
- `components/shipment/stacked-section.tsx` - [NEW] Wrapper component for each section (Pick-up, Drop-off, etc.) with collapse/expand logic.
- `components/shipment/summary-drawer.tsx` - [NEW] Drawer component for final shipment review.
- `store/shipment-store.ts` - State management for the multi-step form and persistence logic.
- `components/shipment/address-form.tsx` - Existing component to be updated with new labels and styles.
- `app/(marketing)/shipping-estimate/page.tsx` - Reference for "double-fitting" selectors and high-contrast UI patterns.
- `changelog.md` - For documenting the major redesign.

### Notes

- Use `framer-motion` for smooth transitions between expanding/collapsing sections if available, otherwise use Tailwind transitions.
- Ensure that the "Next" button in each section scrolls the next section into view smoothly.
- Termination of the flow should clear the `shipment-store` completely.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

### Phase 1: Initial Setup & Foundation

- [x] GS00: Project initialization and feature branch
  - [x] GS01: Create feature branch `feature/redesign-quick-shipment`
  - [x] GS02: Update `changelog.md` with version bump and "Planned" redesign section
- [/] UI00: Single-page layout container and vertical timeline
  - [x] UI001: Create `VerticalTimeline` component with active, completed, and pending states
  - [x] UI002: Create `StackedSection` component wrapper with "Summary" vs "Edit" modes
  - [/] UI003: Remap `/app/shipments/new` to use the new stacked layout instead of redirecting to `/origin`

### Phase 2: Section Implementation & Porting Components

- [x] UI01: "Pick-up Details" and "Drop-off Details" sections
  - [x] UI101: Implement "Pick-up Details" section (previously Origin) with custom terminology
  - [x] UI102: Implement "Drop-off Details" section (previously Destination) with custom terminology
  - [x] UI103: Integrate high-contrast input styles and "double-fitting" selectors from quote page
- [ ] UI02: "Package Details" and "Service Selection" sections
  - [x] UI201: Port "Package Details" UI including presets and dimensions/weight inputs
  - [x] UI202: Implement "Service Selection" section to load after package details are valid
  - [x] UI203: Implement `SummaryDrawer` with "Done" button to finalize shipment

### Phase 3: Logic, State & Interactivity

- [/] LS00: `useShipmentStore` refactor and persistence logic
  - [/] LS001: Update `useShipmentStore` to track `completedSteps` and validation status per section
  - [/] LS002: Implement "Clear on Unmount" logic to prevent state hanging after navigation away
  - [ ] LS003: Implement logic to automatically transition to "Summary" view when a section is submitted
- [ ] LS01: Sequential section loading and manual toggle interactivity
  - [ ] LS101: Implement logic to only render/reveal the next section when the previous one is valid
  - [ ] LS102: Add "Edit" button to summarized sections to allow manual expansion
  - [ ] LS103: Implement "Read-only" style with checkmarks for completed steps in the timeline
  - [ ] LS104: Change "Next" to "Complete" on last task or when fully valid, triggering drawer
  - [ ] LS105: Implement "Unsaved Changes" notice on page and `beforeunload` confirmation dialog

### Phase 4: Final Polish & Verification

- [ ] UI03: Mobile sticky headers and responsive adjustments
  - [ ] UI301: Implement sticky headers for sections on mobile screens
  - [ ] UI302: Hide `VerticalTimeline` on mobile and ensure smooth top-to-bottom scroll
- [ ] TS00: Verification plan and final walkthrough
  - [ ] TS001: Run `bunx tsc --noEmit` and ESLint checks
  - [ ] TS002: Perform manual end-to-end testing of the creation flow
  - [ ] TS003: Create `walkthrough.md` with visual proof of implementation
