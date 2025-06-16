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