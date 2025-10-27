# PageCard Component Specification

## Component Purpose
A standardized, reusable page layout component that provides consistent structure across all pages with corner navigation buttons, centered headers, and content areas.

## TypeScript Interface

```typescript
// src/components/ui/page-card.tsx

import { ReactNode } from 'react';

export interface PageCardButton {
  icon: ReactNode;
  onClick: () => void;
  label: string; // For aria-label
  variant?: 'primary' | 'secondary' | 'danger';
  showWarning?: boolean; // Show unsaved changes warning
}

export interface PageCardProps {
  // Navigation Buttons
  topLeftButton?: PageCardButton;
  topRightButtons?: PageCardButton[]; // Array to support multiple buttons
  
  // Header
  title: string;
  subtitle?: string;
  titleIcon?: ReactNode;
  
  // Content
  children: ReactNode;
  
  // Layout Options
  variant?: 'default' | 'elevated' | 'floating';
  contentClassName?: string;
  centerContent?: boolean; // Center the content vertically
  fullHeight?: boolean; // Make card fill viewport height
  
  // Styling
  className?: string;
  
  // Behavior
  showDivider?: boolean; // Show line between header and content
  hasUnsavedChanges?: boolean; // Used by navigation warnings
}
```

## Component Structure

```tsx
import { motion } from 'framer-motion';
import { AnimatedCard } from './animated-card';
import { AnimatedButton } from './animated-button';
import { useGameStore } from '@/store/gameStore';

export function PageCard({
  topLeftButton,
  topRightButtons = [],
  title,
  subtitle,
  titleIcon,
  children,
  variant = 'elevated',
  contentClassName = '',
  centerContent = false,
  fullHeight = false,
  className = '',
  showDivider = false,
  hasUnsavedChanges = false,
}: PageCardProps) {
  
  const handleNavigationWithWarning = (onClick: () => void, showWarning?: boolean) => {
    if (showWarning && hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Continue?')) {
        onClick();
      }
    } else {
      onClick();
    }
  };

  return (
    <div className={`min-h-screen p-4 flex items-center justify-center ${fullHeight ? 'h-screen' : ''}`}>
      <div className={`max-w-4xl w-full ${className}`}>
        <AnimatedCard 
          variant={variant}
          className="overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Top Navigation Row */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start justify-between"
            >
              {/* Top Left Button */}
              <div className="flex-shrink-0">
                {topLeftButton ? (
                  <AnimatedButton
                    variant={topLeftButton.variant || 'secondary'}
                    onClick={() => handleNavigationWithWarning(
                      topLeftButton.onClick,
                      topLeftButton.showWarning
                    )}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0"
                    aria-label={topLeftButton.label}
                  >
                    {topLeftButton.icon}
                  </AnimatedButton>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14" /> /* Spacer for alignment */
                )}
              </div>

              {/* Top Right Buttons */}
              <div className="flex-shrink-0 flex items-center space-x-2">
                {topRightButtons.map((button, index) => (
                  <AnimatedButton
                    key={index}
                    variant={button.variant || 'secondary'}
                    onClick={() => handleNavigationWithWarning(
                      button.onClick,
                      button.showWarning
                    )}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0"
                    aria-label={button.label}
                  >
                    {button.icon}
                  </AnimatedButton>
                ))}
                {topRightButtons.length === 0 && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14" /> /* Spacer */
                )}
              </div>
            </motion.div>

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center space-y-2"
            >
              {titleIcon && (
                <div className="flex justify-center">
                  {titleIcon}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-semibold">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Optional Divider */}
            {showDivider && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="border-t-2 border-amber-200"
              />
            )}

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`${centerContent ? 'flex items-center justify-center' : ''} ${contentClassName}`}
            >
              {children}
            </motion.div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
```

## Usage Examples

### Example 1: Player Count Selector (Simple)
```tsx
import { PageCard } from '@/components/ui/page-card';
import { Home, Users } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export function PlayerCountSelector() {
  const { setView } = useGameStore();

  return (
    <PageCard
      topRightButtons={[{
        icon: <Home className="h-6 w-6" />,
        onClick: () => setView('home'),
        label: 'Go to home',
      }]}
      title="How many players?"
      titleIcon={
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-xl">
          <Users className="h-10 w-10 text-white" />
        </div>
      }
      variant="elevated"
    >
      {/* Player count selector content */}
      <div className="space-y-6">
        {/* ... existing content ... */}
      </div>
    </PageCard>
  );
}
```

### Example 2: Player Details Form (With Back Button)
```tsx
import { PageCard } from '@/components/ui/page-card';
import { Home, ChevronLeft, Users } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export function PlayerDetailsForm() {
  const { setView, goToPreviousView } = useGameStore();

  return (
    <PageCard
      topLeftButton={{
        icon: <ChevronLeft className="h-6 w-6" />,
        onClick: goToPreviousView,
        label: 'Go back',
      }}
      topRightButtons={[{
        icon: <Home className="h-6 w-6" />,
        onClick: () => setView('home'),
        label: 'Go to home',
      }]}
      title="Who's playing?"
      titleIcon={
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl">
          <Users className="h-10 w-10 text-white" />
        </div>
      }
      variant="elevated"
      showDivider
    >
      {/* Form content */}
      <div className="space-y-4">
        {/* ... name inputs ... */}
      </div>
    </PageCard>
  );
}
```

### Example 3: Call Entry (With Unsaved Warning)
```tsx
import { PageCard } from '@/components/ui/page-card';
import { Home, Menu, Crown } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export function CallEntry() {
  const { setView, currentGame, hasUnsavedChanges } = useGameStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <PageCard
      topLeftButton={{
        icon: <Home className="h-6 w-6" />,
        onClick: () => setView('home'),
        label: 'Go to home',
        showWarning: true, // Will check hasUnsavedChanges
      }}
      topRightButtons={[{
        icon: <Menu className="h-6 w-6" />,
        onClick: () => setShowMenu(true),
        label: 'Open menu',
      }]}
      title={`Round ${currentGame?.currentRound} of 5`}
      subtitle={`Dealer: ${dealer?.name}`}
      titleIcon={<Crown className="h-8 w-8 text-amber-600 fill-amber-600" />}
      variant="elevated"
      hasUnsavedChanges={hasUnsavedChanges}
    >
      {/* Calling interface */}
      <div className="space-y-6">
        {/* ... existing call entry UI ... */}
      </div>
    </PageCard>
  );
}
```

### Example 4: Round Summary (Multiple Top-Right Buttons)
```tsx
import { PageCard } from '@/components/ui/page-card';
import { Home, ClipboardList, ChevronLeft, Trophy } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export function RoundSummary() {
  const { setView, currentGame } = useGameStore();
  const canGoBack = currentGame && currentGame.currentRound > 1;

  return (
    <PageCard
      topLeftButton={canGoBack ? {
        icon: <ChevronLeft className="h-6 w-6" />,
        onClick: () => setView('call-log'),
        label: 'View previous rounds',
      } : undefined}
      topRightButtons={[
        {
          icon: <ClipboardList className="h-5 w-5" />,
          onClick: () => setView('call-log'),
          label: 'View game log',
        },
        {
          icon: <Home className="h-6 w-6" />,
          onClick: () => setView('home'),
          label: 'Go to home',
        }
      ]}
      title={`Round ${currentGame?.currentRound} Complete!`}
      titleIcon={<Trophy className="h-8 w-8 text-amber-600 fill-amber-600" />}
      variant="elevated"
    >
      {/* Score display */}
      <div className="space-y-4">
        {/* ... score cards ... */}
      </div>
    </PageCard>
  );
}
```

### Example 5: Call Log (Special Table Layout)
```tsx
import { PageCard } from '@/components/ui/page-card';
import { Home, ArrowLeft, Scroll } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export function CallLog() {
  const { setView, currentGame } = useGameStore();
  
  const handleBack = () => {
    // Intelligent back navigation based on game state
    if (currentGame?.status === 'completed') {
      setView('game-complete');
    } else {
      setView('round-summary');
    }
  };

  return (
    <PageCard
      topLeftButton={{
        icon: <ArrowLeft className="h-6 w-6" />,
        onClick: handleBack,
        label: 'Go back',
      }}
      topRightButtons={[{
        icon: <Home className="h-6 w-6" />,
        onClick: () => setView('home'),
        label: 'Go to home',
      }]}
      title="Game Ledger"
      subtitle="Complete match history"
      titleIcon={<Scroll className="h-8 w-8 text-amber-600" />}
      variant="elevated"
      contentClassName="overflow-x-auto" // Allow horizontal scroll
      className="max-w-5xl" // Wider for table
    >
      {/* Table content - will scroll horizontally if needed */}
      <table className="w-full">
        {/* ... table structure ... */}
      </table>
    </PageCard>
  );
}
```

## Integration with Existing Store

The PageCard component integrates with the existing game store:

```typescript
// In useGameStore
interface GameStore {
  // ... existing state ...
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  
  // Navigation helpers
  goHome: () => void;
  goToPreviousView: () => void;
  setView: (view: ViewType) => void;
}
```

## Responsive Behavior

The component automatically handles responsive sizing:

```css
/* Button sizes adapt via Tailwind classes */
w-12 h-12 sm:w-14 sm:h-14  /* 48px mobile, 56px desktop */

/* Title text scales */
text-2xl sm:text-3xl lg:text-4xl

/* Subtitle text scales */
text-sm sm:text-base lg:text-lg

/* Card padding remains consistent */
p-6  /* 24px all breakpoints for uniform feel */
```

## Animation Timing

```
0ms   - Page loads, card appears
0ms   - Top buttons slide in from corners
100ms - Header fades and scales in
200ms - Content fades up
```

Staggered timing creates smooth, professional feel without being slow.

## Accessibility Features

1. **Keyboard Navigation:**
   - Tab through buttons in logical order (left → right → content)
   - Enter/Space to activate buttons
   - Escape to trigger back button if present

2. **Screen Reader Support:**
   - All icon buttons have aria-label
   - Page title announced on mount
   - Warning dialogs are modal and announced

3. **Touch Targets:**
   - Minimum 48x48px on mobile
   - 56x56px on desktop for comfort
   - 8px spacing between adjacent buttons

4. **Focus Management:**
   - Focus moves to first interactive element on page load
   - Focus returns to trigger when closing modals
   - Visible focus indicators on all interactive elements

## Testing Checklist

### Functional Tests
- [ ] Navigation buttons trigger correct actions
- [ ] Unsaved changes warning shows when expected
- [ ] Multiple top-right buttons display correctly
- [ ] Spacer divs maintain alignment when buttons absent
- [ ] Content area scrolls independently if needed

### Visual Tests
- [ ] Card appears centered on all screen sizes
- [ ] Buttons positioned in exact corners
- [ ] Title perfectly centered between buttons
- [ ] Animations smooth and timely
- [ ] No layout shift during animations

### Responsive Tests
- [ ] Mobile (< 640px): Smaller buttons, readable text
- [ ] Tablet (640-1024px): Medium sizing
- [ ] Desktop (> 1024px): Full sizing
- [ ] Horizontal scroll on tables works smoothly

### Accessibility Tests
- [ ] Screen reader announces page correctly
- [ ] Keyboard navigation flows logically
- [ ] Touch targets meet 44px minimum
- [ ] Color contrast passes WCAG AA
- [ ] Focus indicators visible

## Migration Strategy

1. **Create Component:** Build PageCard with full features
2. **Test in Isolation:** Storybook or standalone test
3. **Pilot Page:** Migrate PlayerCountSelector first
4. **Iterate:** Refine based on first implementation
5. **Roll Out:** Migrate remaining pages systematically
6. **Clean Up:** Remove old GameHeader component

## Performance Considerations

- Component renders only when props change
- Animations use GPU-accelerated transforms
- No unnecessary re-renders of content children
- Memoize button click handlers if needed
- Lazy load animations if motion preferences disabled

## Future Enhancements

Potential additions (not part of initial implementation):
- Breadcrumb navigation in header
- Progress indicator for multi-step flows
- Customizable button positions (swap left/right)
- Sticky header option for long scrolling content
- Dark mode support with theme variants