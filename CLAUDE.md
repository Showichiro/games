# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses pnpm as the package manager. Key commands:

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run formatting
pnpm format
```

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS.

**Framework Stack:**
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Motion library (framer-motion) for animations
- Noto Sans JP font configured in layout

**Project Structure:**
- Uses App Router with pages in `app/` directory
- Main layout configured with Japanese font fallbacks
- Currently has a "lights-out" game route at `/lights-out`
- Standard Next.js configuration with minimal customization

**Font Configuration:**
The app uses Noto Sans JP with specific fallbacks for Japanese text support. The font is configured with variable weight and swap display strategy.

**Path Aliases:**
- `@/*` maps to the root directory for imports

### Common UI Components

This project is starting to incorporate a system of common UI components, located in `components/common/`. The goal is to promote consistency, reusability, and maintainability across the UI.

**`Button.tsx` (`components/common/Button.tsx`)**

This is the standard button implementation for the project. It provides a range of predefined styles (variants), sizes, and features.

**Usage Guidelines**:
- **Variants**: Choose a variant that semantically matches the button's action:
    - `primary`: For the most important call to action on a page.
    - `secondary`: For less emphasized actions.
    - `success`: For positive confirmation actions.
    - `ghost`: For subtle actions, like "Cancel", "Close", or tertiary options. Often used where a filled button would be too distracting.
    - `danger`: For actions with destructive consequences (e.g., delete, clear).
    - `info`: For informational callouts or less critical actions.
    - `light` / `dark`: For general use based on background contrast or desired emphasis.
- **Custom Styling**:
    - Prefer using the predefined `variant` and `size` props to maintain consistency.
    - If minor adjustments are needed (e.g., specific margins, slight color deviation for a one-off case), use the `className` prop to pass Tailwind CSS utility classes.
    - For significant, reusable style deviations, consider proposing a new variant or a specialized component (like `LightsOutButton`).
- **Icon Buttons**:
    - For buttons that only contain an icon, always use the `IconButton` specialized component. This ensures proper padding, accessibility (`aria-label`), and consistent styling for icon-only actions.
    - Example: `<IconButton icon={<MyIcon />} aria-label="Perform action" onClick={handler} />`
- **Loading State**: Utilize the `isLoading` prop for buttons that trigger asynchronous operations. This provides visual feedback to the user.
- **Full Width**: Use `fullWidth` prop when a button needs to span the entire width of its container.

**Migration from `lights-out`**:
The buttons previously defined within the `lights-out` game components (`app/lights-out/components/`) have been migrated to use this common `Button.tsx` component. This change centralizes button styling and behavior, removing redundant CSS and component definitions from the feature-specific code. Future features should leverage this common `Button` component.

## Code Formatting

This project uses Biome for code formatting and organization:

**Formatting Rules:**
- Indent style: spaces (4 spaces)
- Quote style: double quotes for JavaScript/TypeScript
- Organize imports: enabled
- Linting: disabled (using ESLint instead)

**Commands:**
- `pnpm format` - Format all files using Biome
- Biome ignores `.next` and `.claude` directories

The formatter enforces consistent code style across the project automatically.

## Development Workflow

**Pre-commit Quality Checks:**
Before committing any changes, always run the following commands in order:
1. `pnpm lint` - Check for linting errors
2. `pnpm format` - Apply code formatting 
3. `pnpm build` - Verify the build passes

Only commit changes if all three commands complete successfully without errors. This ensures code quality and prevents CI/CD failures.

## Animation Library

This project uses the Motion library (framer-motion) for animations:

**Animation Principles:**
- Smooth, natural motion with spring physics
- Meaningful animations that enhance UX
- Mobile-optimized touch interactions
- Performance-conscious animation patterns

**Common Animation Patterns:**
- `whileTap={{ scale: 0.9 }}` - Touch feedback on interactive elements
- `animate={{ rotate: isActive ? 180 : 0 }}` - State-based rotations
- `transition={{ type: "spring", stiffness: 300, damping: 20 }}` - Spring physics
- `AnimatePresence` - Enter/exit animations for modals and overlays
- `initial={{ opacity: 0 }}` and `animate={{ opacity: 1 }}` - Fade transitions

**Performance Considerations:**
- Use `transform` properties (scale, rotate, translate) for GPU acceleration
- Avoid animating layout-affecting properties when possible
- Leverage `will-change` optimization (handled automatically by Motion)
- Use `layout` prop carefully for layout animations

**Accessibility:**
- Respect user's reduced motion preferences
- Provide appropriate animation durations (not too fast/slow)
- Ensure animations don't interfere with functionality

## Development Workflow

- 作業が完了したらlint/format/buildを確認して問題なければコミットするというルールを記録
- コミット前にcheckコマンドを実行する旨記録