# AI Coding Agent Guide for juncom-rental

## Project Overview
**juncom-rental** is a React + TypeScript + Vite web application for renting computers (gaming PCs, workstations, development machines). The project uses Korean language for UI content and demonstrates a rental marketplace interface.

## Architecture

### Tech Stack
- **Frontend Framework**: React 19 + TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + custom color palette
- **State Management**: Zustand 5
- **Routing**: React Router v7
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **UI Components**: Custom components (no external UI library)

### Key Files & Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── ComputerCard.tsx     # Individual computer rental card with heart favorite button
│   ├── ComputerSection.tsx  # Carousel section displaying computer lists
│   ├── SearchBar.tsx        # Search input with animated gradient button
│   ├── HeroBanner.tsx       # Hero section
│   ├── CategoryGrid.tsx     # Category selection grid
│   └── ServiceMenu.tsx      # Service menu
├── pages/
│   └── HomePage.tsx     # Main landing page (only page currently)
├── types/
│   ├── ComputerStore.ts # Zustand store + Computer interface
│   └── MockData.ts      # Mock computer rental data
└── tailwind.config.js   # Tailwind configuration with custom primary/accent colors
```

## Data Model & State Management

### Computer Interface
Located in `src/types/ComputerStore.ts`:
```typescript
interface Computer {
    id, name, category, specs (cpu/gpu/ram/storage), 
    price, priceUnit ('hour'|'day'|'month'), image, 
    rating, reviews, available (boolean), tags
}
```

### Store Pattern (Zustand)
- Single store: `useComputerStore` manages:
  - Three computer lists: `allComputers`, `popularComputers`, `featuredComputers`
  - Loading states: `isLoadingAll`, `isLoadingPopular`, `isLoadingFeatured`
  - `favorites` array (computer IDs as strings)
  - `selectedTab` for tab switching
- Data flows: `MockData.ts` → `HomePage.tsx` loads data → `useComputerStore` → components consume via hooks

### Mock Data
`src/types/MockData.ts` contains hardcoded `mockComputers` array. Categories include: 'gaming', 'workstation', 'development'. Prices vary by unit (hour, day, month with Korean 원 currency).

## Component Patterns

### Animation & Motion
Components use `framer-motion` for smooth transitions:
- `ComputerCard`: Card hover animation (`y: -5`), image scale on hover
- `SearchBar`: Fade-in animation on mount
- Use `motion.div` with `initial`, `animate`, `whileHover` props

### Styling Conventions
- **Tailwind only** - no CSS-in-JS or external component libraries
- **Responsive**: Mobile-first with Tailwind breakpoints
- **Colors**: Use `primary-*` and `accent-*` color tokens (custom Tailwind palette)
- **Typography**: Prefer `line-clamp-*` for text overflow, `group-hover:` for nested interactivity
- **Layout**: Flexbox/grid patterns with `gap`, `flex-wrap`, `justify-between`

### State Consumption Pattern
Components consume store via destructuring from hooks:
```tsx
const { favorites, toggleFavorite } = useComputerStore();
```
Avoid creating intermediate state; use store directly.

## Build & Development

### NPM Scripts
```bash
npm run dev      # Start Vite dev server (port 3000)
npm run build    # TypeScript check + Vite build to dist/
npm run lint     # ESLint check (eslint.config.js)
npm run preview  # Preview production build locally
```

### Dev Server
- **Port**: 3000 (configured in `vite.config.ts`)
- **HMR**: Hot Module Replacement enabled by default
- No authentication or API integration required yet

## Key Conventions & Gotchas

1. **Korean UI Content**: All user-facing text is in Korean (보기, 시간, 일, 월, etc.). When adding new features, maintain Korean labels.

2. **Price Formatting**: Use `formatPrice(price, unit)` helper in `ComputerCard.tsx` - returns formatted string with currency (원) and time unit.

3. **Favorite Toggle Pattern**: `toggleFavorite(id)` uses array filter/concat, not Set. Favorites stored as string IDs.

4. **Image URLs**: Uses Unsplash URLs for mock images. Consider placeholder handling for missing images.

5. **Loading Simulation**: `HomePage.tsx` simulates API delays with `setTimeout(800ms)`. Replace with actual API calls later.

6. **No Error Boundaries**: Error handling not yet implemented - add when integrating real APIs.

7. **Mock Data Categories**: Category values must match mock data ('gaming', 'workstation', 'development') when filtering.

## Integration Points

- **Future API Integration**: Replace `mockComputers` data loading in `HomePage.useEffect` with actual API calls
- **Search Implementation**: `SearchBar.tsx` is UI-only placeholder; implement filtering via store actions
- **Routing**: `App.tsx` uses BrowserRouter; add new pages by creating `.tsx` files in `src/pages/` and adding Route entries
- **Component Library**: Swap individual components for UI library without changing state management pattern

## Common Tasks

- **Add new Computer category**: Add to MockData.ts, update CategoryGrid.tsx filtering
- **New page**: Create file in `src/pages/`, add Route in `App.tsx`, use store hooks for data
- **New component**: Place in `src/components/`, export named export, use Zustand store for state
- **Styling changes**: Edit `src/tailwind.config.js` for theme, use class names in components
