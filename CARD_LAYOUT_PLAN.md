# Single Card Layout Implementation Plan

## Overview
Implement a consistent single-card layout pattern across ALL pages with navigation buttons positioned at the top corners INSIDE the card padding, and page headers centered below them.

## Design Specifications

### Card Layout Structure
```
┌─────────────────────────────────────────────┐
│  [Back]                      [Home/Menu]    │  <- Corner buttons (top left/right)
│                                             │
│              Page Title                     │  <- Centered header
│              Subtext                        │  <- Centered subtitle
│  ─────────────────────────────────────────  │
│                                             │
│           Main Content Area                 │
│                                             │
│                                             │
│           Action Buttons                    │  <- Bottom section
└─────────────────────────────────────────────┘
```

### Button Positioning Rules

**Top Left Corner:**
- Back/Previous button (ChevronLeft icon)
- Used on: Setup pages (after first), Gameplay pages, Detail views
- Exception: First setup page and Home (no back button)

**Top Right Corner:**
- Home button (Home icon) - Most pages
- Menu button (Menu icon) - Gameplay pages with additional actions
- Can have multiple buttons if needed (e.g., Home + Log view)

**Context-Aware Buttons:**
- Player count page: Only Home (no back)
- Home page: No corner buttons (special case)
- Gameplay pages: May have both Home + Call Log
- History detail: Back button to return to list

## Component Architecture

### 1. Create PageCard Component
**Location:** `src/components/ui/page-card.tsx`

**Props:**
```typescript
interface PageCardProps {
  // Navigation
  showBackButton?: boolean;
  onBack?: () => void;
  showHomeButton?: boolean;
  onHome?: () => void;
  
  // Additional top-right buttons
  topRightButtons?: React.ReactNode;
  
  // Header content
  title: string;
  subtitle?: string;
  titleIcon?: React.ReactNode;
  
  // Content
  children: React.ReactNode;
  
  // Styling
  variant?: 'default' | 'elevated' | 'floating';
  className?: string;
  contentClassName?: string;
  
  // Layout
  centerContent?: boolean; // For centered layouts like player count
  fullHeight?: boolean; // For pages that need full height
}
```

**Features:**
- Consistent padding and spacing
- Responsive button sizing
- Automatic navigation handling
- Optional confirmation for back/home with unsaved changes
- Animation support via framer-motion

### 2. Page-Specific Implementations

#### Home Screen
- Special case: No corner buttons
- Card contains: Decorative header, game status, action buttons
- Keep existing fancy card display with floating cards

#### Setup Pages (4 pages)

**PlayerCountSelector:**
- Top left: None (first page)
- Top right: Home button
- Header: "How many players?" with Users icon
- Content: Number selector (existing)
- Bottom: Continue button

**PlayerDetailsForm:**
- Top left: Back button → PlayerCountSelector
- Top right: Home button
- Header: "Who's playing?" with Users icon
- Content: Name inputs (existing)
- Bottom: Continue button

**PlayerRolesSetup:**
- Top left: Back button → PlayerDetailsForm
- Top right: Home button
- Header: "Arrange seating" with relevant icon
- Content: Drag-drop player arrangement (existing)
- Bottom: Continue button

**StakesSetup:**
- Top left: Back button → PlayerRolesSetup
- Top right: Home button
- Header: "Set stakes" with relevant icon
- Content: Stakes configuration (existing)
- Bottom: Start Game button

#### Gameplay Pages (4 pages)

**CallEntry:**
- Top left: Home button (with unsaved warning)
- Top right: Menu button (Cancel game)
- Header: "Round X of 5" with Crown icon
- Subtitle: "Dealer: [Name]"
- Content: Current player calling UI (existing)
- Bottom: Confirm button (when all calls made)

**ResultEntry:**
- Top left: Home button (with unsaved warning)
- Top right: Menu button
- Header: "Round X of 5" with Trophy icon
- Subtitle: "Count your tricks"
- Content: Result entry forms (existing)
- Bottom: Confirm Results button

**RoundSummary:**
- Top left: Previous round button (if not round 1)
- Top right: Home button + Call Log button
- Header: "Round X Complete!" with Trophy icon
- Content: Score cards (existing)
- Bottom: Next Round / Finish Game button

**CallLog:**
- Top left: Back button (returns to appropriate view)
- Top right: Home button
- Header: "Game Ledger" with Scroll icon
- Subtitle: "Complete match history"
- Content: Scrollable table (existing, may need horizontal scroll handling)
- Bottom: Back button (optional, redundant with top left)

#### Other Pages

**GameComplete:**
- Top left: None (game over, no back)
- Top right: Home button
- Header: "Victory!" with Trophy icon
- Subtitle: Champion name
- Content: Final standings (existing)
- Bottom: Play Again + View Ledger + Home buttons

**GameHistory (List):**
- Top left: Back to Home
- Top right: None (back is primary action)
- Header: "Game History" with History icon
- Subtitle: "X completed • Y in progress"
- Content: Game cards list (existing)
- Bottom: None (scroll list)

**GameHistory (Detail):**
- Top left: Back to list
- Top right: None
- Header: "Game Details" with relevant icon
- Subtitle: Date
- Content: Winner + standings + rounds (existing)
- Bottom: None (scroll content)

## Implementation Strategy

### Phase 1: Create PageCard Component
1. Build reusable PageCard component with all features
2. Include proper TypeScript types
3. Add animation support
4. Handle unsaved changes warnings
5. Make responsive (buttons, spacing, text sizes)

### Phase 2: Remove Old Header System
1. Remove `<GameHeader>` from App.tsx
2. Remove conditional header display logic
3. Keep CardBackground for consistent backgrounds
4. Update App.tsx to pass through pages cleanly

### Phase 3: Update Each Page (Priority Order)
1. **Start with simplest:** PlayerCountSelector (test pattern)
2. **Setup pages:** PlayerDetailsForm, PlayerRolesSetup, StakesSetup
3. **Gameplay pages:** CallEntry, ResultEntry, RoundSummary
4. **Complex pages:** CallLog (table handling), GameComplete
5. **History pages:** GameHistory list and detail views
6. **Special case:** HomeScreen (maintain uniqueness, no corner buttons)

### Phase 4: Testing & Refinement
1. Test navigation flow through entire game
2. Verify unsaved changes warnings work
3. Check responsive behavior on mobile/tablet/desktop
4. Ensure animations are smooth and consistent
5. Validate accessibility (touch targets, keyboard nav)

## Key Considerations

### For Table Pages (CallLog, GameHistory Detail)
- Card may need to be full-width or wider
- Consider making card container scrollable
- Corner buttons should stay fixed during horizontal scroll
- Test on mobile where horizontal scroll is more common

### Responsive Breakpoints
- Mobile (< 640px): Smaller buttons, tighter padding
- Tablet (640px - 1024px): Medium buttons, standard padding
- Desktop (> 1024px): Full-size buttons, generous padding

### Animation Consistency
- All pages should use same transition types
- Corner buttons animate in from their respective corners
- Header fades in after buttons
- Content staggers in after header
- Maintain existing card entrance animations

### Accessibility
- All corner buttons must be at least 44x44px touch targets
- Proper ARIA labels for icon-only buttons
- Keyboard navigation support (Tab, Enter, Escape)
- Screen reader announcements for page changes

## File Structure

```
src/
  components/
    ui/
      page-card.tsx          # NEW: Main page card component
      card.tsx               # Keep existing (used by PageCard)
      animated-card.tsx      # Keep existing (used by PageCard)
      button.tsx             # Keep existing
      animated-button.tsx    # Keep existing
    GameHeader.tsx           # DELETE after migration
    HomeScreen.tsx           # UPDATE (special case)
    game-setup/
      PlayerCountSelector.tsx      # UPDATE
      PlayerDetailsForm.tsx        # UPDATE
      PlayerRolesSetup.tsx         # UPDATE (read file first)
      StakesSetup.tsx              # UPDATE (read file first)
    gameplay/
      CallEntry.tsx                # UPDATE
      ResultEntry.tsx              # UPDATE
      RoundSummary.tsx             # UPDATE
      CallLog.tsx                  # UPDATE (special handling)
      GameComplete.tsx             # UPDATE
    GameHistory.tsx                # UPDATE (both views)
  App.tsx                    # UPDATE: Remove GameHeader
```

## Success Criteria

✅ Every page has exactly one main card
✅ Corner buttons positioned consistently (top-left, top-right)
✅ Page title always centered below corner buttons
✅ Navigation flow works seamlessly
✅ No floating navigation bars or headers outside cards
✅ Responsive on all screen sizes
✅ Animations smooth and consistent
✅ Unsaved changes warnings work correctly
✅ All existing functionality preserved

## Migration Checklist

- [ ] Create PageCard component with full feature set
- [ ] Test PageCard in isolation with various configurations
- [ ] Update App.tsx to remove GameHeader
- [ ] Migrate PlayerCountSelector (simplest test case)
- [ ] Migrate remaining setup pages
- [ ] Migrate gameplay pages
- [ ] Migrate CallLog with table considerations
- [ ] Migrate GameComplete
- [ ] Migrate GameHistory (both views)
- [ ] Handle HomeScreen special case
- [ ] Delete GameHeader.tsx
- [ ] Full application testing
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit