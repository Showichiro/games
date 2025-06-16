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
```

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS.

**Framework Stack:**
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Motion library for animations
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