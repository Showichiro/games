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

## Code Review Guidelines

### Review Principles

**Quality First:**
- Code must pass all quality checks (`pnpm lint`, `pnpm format`, `pnpm build`) before review
- Reviews should focus on architecture, logic, and maintainability, not formatting
- Ensure TypeScript strict mode compliance and proper type safety

**Consistency and Standards:**
- Follow existing project patterns and conventions
- Use established common components (`components/common/`) when possible
- Maintain consistent naming conventions across the codebase
- Adhere to the established file and folder structure (`app/` for pages, `components/` for reusable UI)

**Performance and User Experience:**
- Review animation implementations for performance impact
- Ensure proper loading states and error handling
- Validate mobile responsiveness and accessibility
- Check for unnecessary re-renders and optimize React components

### Review Checklist

**Code Structure:**
- [ ] Follows Next.js App Router conventions
- [ ] Uses TypeScript properly with appropriate types
- [ ] Imports are organized (handled by Biome)
- [ ] Path aliases (`@/*`) are used correctly
- [ ] Common components are reused where appropriate

**React Best Practices:**
- [ ] Components are properly memoized when needed
- [ ] Hooks are used correctly and follow rules of hooks
- [ ] State management is appropriate for the use case
- [ ] Event handlers are properly defined and don't cause unnecessary re-renders

**Styling and UI:**
- [ ] Tailwind CSS classes are used consistently
- [ ] Motion animations follow established patterns
- [ ] Responsive design is implemented
- [ ] Button variants are semantically appropriate
- [ ] Accessibility attributes are included where needed

**Performance:**
- [ ] No unnecessary dependencies are added
- [ ] Images and assets are optimized
- [ ] Client/server components are used appropriately
- [ ] Bundle size impact is considered

**Security:**
- [ ] **Input Sanitization:** Verify that all user-supplied input (forms, URL parameters, headers, etc.) is properly sanitized/validated to prevent common injection attacks (e.g., XSS, SQLi).
- [ ] **Authentication:** Ensure that authentication mechanisms are robust, securely implemented, and protect against common vulnerabilities (e.g., weak passwords, session hijacking, insecure password recovery).
- [ ] **Authorization:** Confirm that proper authorization checks are in place for all sensitive actions and data access, preventing unauthorized access and Insecure Direct Object References (IDOR).
- [ ] **Sensitive Data Handling:** Check that sensitive data (PII, credentials, API keys) is handled securely:
    - [ ] Avoid logging sensitive information.
    - [ ] Encrypt sensitive data at rest and in transit (HTTPS).
    - [ ] Store secrets securely (e.g., using environment variables or a secrets manager, not hardcoded).
- [ ] **OWASP Top 10 Awareness:** Review code with an awareness of common vulnerabilities (e.g., Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable and Outdated Components, Identification and Authentication Failures, Software and Data Integrity Failures, Security Logging and Monitoring Failures, Server-Side Request Forgery).
- [ ] **Dependency Security:** Verify that third-party libraries and dependencies are up-to-date and free from known vulnerabilities.
- [ ] **Secure Headers:** Ensure that appropriate security headers (e.g., Content Security Policy, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security) are configured.

**Testing and Quality:**
- [ ] All quality checks pass (`pnpm lint`, `pnpm format`, `pnpm build`)
- [ ] Code is readable and well-documented
- [ ] Error boundaries and error handling are in place
- [ ] No console errors or warnings in development

### Common Issues to Watch For

**TypeScript:**
- Missing or `any` types
- Improper use of assertions
- Missing null/undefined checks

**React:**
- Direct state mutation
- Missing dependencies in effect hooks
- Improper key props in lists
- Memory leaks from uncleared subscriptions

**Performance:**
- Large bundle imports
- Unnecessary re-renders
- Missing memoization for expensive operations
- Layout thrashing from animations

**Accessibility:**
- Missing alt text for images
- Poor keyboard navigation
- Insufficient color contrast
- Missing ARIA labels

### Communication Guidelines

**Constructive Feedback:**
- Explain the "why" behind suggestions
- Provide specific examples or documentation links
- Suggest alternatives rather than just pointing out problems
- Focus on code improvement, not personal criticism

**Efficient Reviews:**
- Review in small, focused chunks
- Prioritize high-impact issues first
- Use code comments for specific line feedback
- Summarize overall architectural concerns separately