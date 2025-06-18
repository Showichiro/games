This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Common UI Components

This project includes a set of reusable UI components located in `components/common/`.

### Button Component

A versatile button component (`components/common/Button.tsx`) is provided to ensure consistent styling and behavior for buttons across the application.

**Purpose**:
To offer a standardized set of button styles and functionalities, reducing code duplication and ensuring a cohesive user interface.

**Available Variants**:
The `Button` component supports the following variants, which define its visual appearance:
- `primary`: For the main call to action.
- `secondary`: For secondary actions.
- `success`: For actions indicating a successful operation or outcome.
- `ghost`: For subtle actions, often used for tertiary buttons or when a less prominent button is needed (e.g., "Cancel" or "Close" actions that are not the primary focus).
- `danger`: For actions that have destructive consequences (e.g., delete, remove).
- `info`: For informational actions or callouts.
- `light`: A light-themed button, suitable for use on darker backgrounds or when a less emphasized button is required.
- `dark`: A dark-themed button, suitable for general use or on lighter backgrounds.

**Available Sizes**:
Buttons can be rendered in several sizes:
- `xs` (Extra Small)
- `sm` (Small)
- `md` (Medium - default)
- `lg` (Large)
- `xl` (Extra Large)

**Key Features**:
- **Icon Support**: Can include an icon on the left or right side of the button text using the `icon` and `iconPosition` props.
- **Loading State**: A `isLoading` prop can be used to display a loading spinner within the button and disable it.
- **Full Width**: The `fullWidth` prop makes the button span the entire width of its container.
- **Animation**: Supports `framer-motion` props via the `motionProps` prop for custom animations.
- **Accessibility**: Implements `forwardRef` for direct ref access and is designed with ARIA practices in mind (e.g., `IconButton`).

**Basic Usage Example**:
```tsx
import { Button } from '@/components/common';

// ...
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>

<Button variant="ghost" icon={<MyIcon />} iconPosition="left" onClick={handleAction}>
  Action
</Button>
```

**Specialized Components**:
- `IconButton`: A specialized version for icon-only buttons, ensuring proper accessibility and styling.
- `LightsOutButton` (and its presets like `LightsOutPrimaryButton`): These are extensions of the base `Button` specifically styled and animated for the "Lights Out" game, demonstrating how the base `Button` can be customized.

**Migration Note**:
The buttons within the "Lights Out" game feature (located in `app/lights-out/`) have been migrated to use this common `Button` component, centralizing button logic and styling.
