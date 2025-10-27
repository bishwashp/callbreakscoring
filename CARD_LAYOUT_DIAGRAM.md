# Card Layout Visual Architecture

## Page Flow with Card Layout Pattern

```mermaid
graph TD
    Home[Home Screen<br/>NO corner buttons<br/>Special decorative layout]
    
    Home --> |New Game| PC[PlayerCountSelector<br/>Top-Left: NONE<br/>Top-Right: Home]
    
    PC --> |Continue| PD[PlayerDetailsForm<br/>Top-Left: Back<br/>Top-Right: Home]
    
    PD --> |Continue| PR[PlayerRolesSetup<br/>Top-Left: Back<br/>Top-Right: Home]
    
    PR --> |Continue| SS[StakesSetup<br/>Top-Left: Back<br/>Top-Right: Home]
    
    SS --> |Start Game| CE[CallEntry<br/>Top-Left: Home with warning<br/>Top-Right: Menu]
    
    CE --> |Confirm Calls| RE[ResultEntry<br/>Top-Left: Home with warning<br/>Top-Right: Menu]
    
    RE --> |Confirm Results| RS[RoundSummary<br/>Top-Left: Prev Round<br/>Top-Right: Home + Log]
    
    RS --> |Next Round| CE
    RS --> |View Log| CL[CallLog<br/>Top-Left: Back<br/>Top-Right: Home]
    RS --> |Finish Game| GC[GameComplete<br/>Top-Left: NONE<br/>Top-Right: Home]
    
    GC --> |View Ledger| CL
    GC --> |Home| Home
    
    Home --> |History| GH1[GameHistory List<br/>Top-Left: Back<br/>Top-Right: NONE]
    
    GH1 --> |Select Game| GH2[GameHistory Detail<br/>Top-Left: Back<br/>Top-Right: NONE]
    
    GH2 --> |Back| GH1
    GH1 --> |Back| Home
    
    CL --> |Back| RS
    CL --> |Home| Home
    
    style Home fill:#fff3cd,stroke:#ffc107,stroke-width:3px
    style CE fill:#d1ecf1,stroke:#0dcaf0,stroke-width:2px
    style RE fill:#d1ecf1,stroke:#0dcaf0,stroke-width:2px
    style RS fill:#d1ecf1,stroke:#0dcaf0,stroke-width:2px
    style GC fill:#d1f2eb,stroke:#20c997,stroke-width:3px
```

## Card Component Structure

```mermaid
graph TB
    subgraph "PageCard Component"
        TC[Top Container]
        TC --> TL[Top Left Button<br/>Back/Prev/None]
        TC --> TR[Top Right Buttons<br/>Home/Menu/Log]
        
        HC[Header Container]
        HC --> Icon[Title Icon]
        HC --> Title[Page Title]
        HC --> Sub[Subtitle/Context]
        
        CC[Content Container]
        CC --> Main[Main Content Area<br/>Form/Cards/Tables]
        
        BC[Bottom Container]
        BC --> Actions[Action Buttons<br/>Continue/Submit/Next]
    end
    
    TC --> HC
    HC --> CC
    CC --> BC
    
    style TC fill:#e7f3ff,stroke:#0066cc
    style HC fill:#fff7e6,stroke:#ff9800
    style CC fill:#f5f5f5,stroke:#666
    style BC fill:#e8f5e9,stroke:#4caf50
```

## Button Configuration Matrix

| Page | Top-Left | Top-Right | Bottom Primary | Notes |
|------|----------|-----------|----------------|-------|
| **Home** | — | — | New Game, History | Special: No corner buttons |
| **PlayerCount** | — | Home | Continue | First setup page |
| **PlayerDetails** | Back | Home | Continue | Can go back to count |
| **PlayerRoles** | Back | Home | Continue | Seating arrangement |
| **Stakes** | Back | Home | Start Game | Last setup |
| **CallEntry** | Home⚠️ | Menu | Confirm Calls | Unsaved warning |
| **ResultEntry** | Home⚠️ | Menu | Confirm Results | Unsaved warning |
| **RoundSummary** | Prev/— | Home, Log | Next Round | Prev only if R>1 |
| **CallLog** | Back | Home | Back (optional) | Scrollable table |
| **GameComplete** | — | Home | Play Again, View Log, Home | Victory screen |
| **History List** | Back | — | — | Scroll list |
| **History Detail** | Back | — | — | Game details |

⚠️ = Shows warning if unsaved changes exist

## Responsive Behavior

```mermaid
graph LR
    subgraph "Mobile < 640px"
        M1[Compact Buttons<br/>40x40px]
        M2[Reduced Padding<br/>16px]
        M3[Smaller Text<br/>Title: 2xl]
    end
    
    subgraph "Tablet 640-1024px"
        T1[Medium Buttons<br/>48x48px]
        T2[Standard Padding<br/>24px]
        T3[Medium Text<br/>Title: 3xl]
    end
    
    subgraph "Desktop > 1024px"
        D1[Full Buttons<br/>56x56px]
        D2[Generous Padding<br/>32px]
        D3[Large Text<br/>Title: 4xl]
    end
    
    style M1 fill:#ffebee
    style T1 fill:#fff3e0
    style D1 fill:#e8f5e9
```

## Animation Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant PageCard
    participant Buttons
    participant Header
    participant Content

    User->>App: Navigate to page
    App->>PageCard: Mount component
    
    Note over Buttons: 0ms delay
    PageCard->>Buttons: Animate from corners
    Buttons-->>PageCard: Slide in + fade
    
    Note over Header: 100ms delay
    PageCard->>Header: Animate title
    Header-->>PageCard: Fade + scale in
    
    Note over Content: 200ms delay
    PageCard->>Content: Animate content
    Content-->>PageCard: Stagger children in
    
    Note over User: Page fully rendered
```

## Layout Measurements

### Card Padding Structure
```
┌─────────────────────────────────────────┐
│ 24px (p-6)                              │
│  ┌──────────────────────────────────┐   │
│  │ [Btn]                      [Btn] │   │ ← Buttons in padding
│  │                                  │   │
│  │ 24px gap-6                       │   │
│  │                                  │   │
│  │          Page Title              │   │ ← Header section
│  │          Subtitle                │   │
│  │                                  │   │
│  │ ────────────────────────────     │   │ ← Optional divider
│  │                                  │   │
│  │                                  │   │
│  │       Content Area               │   │ ← Main content
│  │                                  │   │
│  │                                  │   │
│  │                                  │   │
│  │ ────────────────────────────     │   │
│  │                                  │   │
│  │    [Action Buttons]              │   │ ← Bottom actions
│  └──────────────────────────────────┘   │
│ 24px (p-6)                              │
└─────────────────────────────────────────┘
```

### Button Sizes (Responsive)
- **Mobile:** 40x40px (w-10 h-10), text-base, icon h-5 w-5
- **Tablet:** 48x48px (w-12 h-12), text-lg, icon h-6 w-6  
- **Desktop:** 56x56px (w-14 h-14), text-xl, icon h-7 w-7

### Typography Scale
- **Title:** text-2xl sm:text-3xl lg:text-4xl
- **Subtitle:** text-sm sm:text-base lg:text-lg
- **Content:** text-base sm:text-lg
- **Buttons:** text-base sm:text-lg lg:text-xl

## Special Cases

### HomeScreen (Unique Layout)
- No PageCard wrapper (keep existing fancy design)
- Maintains decorative floating cards
- Card spread header animation
- Gradient title
- Direct action buttons in separate cards

### CallLog (Table with Scroll)
```
┌─────────────────────────────────────────┐
│ [Back]                          [Home]  │
│                                         │
│            Game Ledger                  │
│         Complete match history          │
│ ─────────────────────────────────────── │
│ ┌─────────────────────────────────────┐ │
│ │ Table with horizontal scroll        │ │
│ │ (if needed on mobile)               │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│          [Back Button]                  │
└─────────────────────────────────────────┘
```

### GameHistory (Two Views)
**List View:**
- Scrollable list of game cards
- Each game card is clickable
- No bottom buttons (scroll to see more)

**Detail View:**
- Scrollable content (winner, standings, rounds)
- Back button returns to list
- No bottom action needed

## Implementation Notes

### Z-Index Management
- Card container: z-0 (base)
- Corner buttons: z-10 (above content)
- Modals/Menus: z-20 (above buttons)
- Loading overlays: z-30 (top layer)

### Touch Target Guidelines
- Minimum 44x44px for all interactive elements
- 8px spacing between touch targets
- Increase button size on mobile if needed
- Consider thumb zones on phone screens

### Accessibility Checklist
- [ ] All icon buttons have aria-label
- [ ] Page title announced on navigation
- [ ] Focus management on page changes
- [ ] Keyboard shortcuts (Esc to go back, etc.)
- [ ] Screen reader announcements for state changes
- [ ] Color contrast meets WCAG AA standards
- [ ] Touch targets meet minimum size requirements