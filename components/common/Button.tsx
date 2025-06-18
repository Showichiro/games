import { MotionProps, motion } from "motion/react";
import React, { forwardRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

// TypeScript types
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "info"
  | "light"
  | "dark"
  | "ghost"; // Added ghost, removed warning, link
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type IconPosition = "left" | "right";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  isLoading?: boolean;
  fullWidth?: boolean;
  motionProps?: MotionProps;
  children?: ReactNode;
  href?: string; // Added to support usage within Next.js Link legacyBehavior
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      isLoading = false,
      fullWidth = false,
      motionProps,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out";

    const variantClasses: Record<ButtonVariant, string> = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
      success:
        "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
      danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
      // warning: 'bg-yellow-500 hover:bg-yellow-600 text-black focus:ring-yellow-400', // Removed
      info: "bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400",
      light: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300",
      dark: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700",
      // link: 'bg-transparent hover:underline text-blue-600 focus:ring-blue-500', // Removed
      ghost:
        "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 focus:ring-blue-500 focus:ring-offset-0",
    };

    const sizeClasses: Record<ButtonSize, string> = {
      xs: "px-2.5 py-1.5 text-xs rounded",
      sm: "px-3 py-2 text-sm leading-4 rounded-md",
      md: "px-4 py-2 text-sm rounded-md",
      lg: "px-4 py-2 text-base rounded-md",
      xl: "px-6 py-3 text-base rounded-md",
    };

    const iconSizeClasses: Record<ButtonSize, string> = {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-5 h-5",
      xl: "w-6 h-6",
    };

    const loadingClasses = "relative";
    const fullWidthClasses = fullWidth
      ? "w-full flex justify-center items-center"
      : "inline-flex items-center";

    const combinedClasses = twMerge(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidthClasses,
      isLoading && loadingClasses,
      className,
    );

    const iconSpacingClass = children
      ? iconPosition === "left"
        ? "mr-2"
        : "ml-2"
      : "";

    return (
      <motion.button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || isLoading}
        {...motionProps}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className={`animate-spin h-5 w-5 text-white`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        <span className={isLoading ? "invisible" : "visible flex items-center"}>
          {icon && iconPosition === "left" && (
            <span className={twMerge(iconSpacingClass, iconSizeClasses[size])}>
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className={twMerge(iconSpacingClass, iconSizeClasses[size])}>
              {icon}
            </span>
          )}
        </span>
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;

// Specialized Button Components
export const PrimaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="primary" {...props} />);
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="secondary" {...props} />);
SecondaryButton.displayName = "SecondaryButton";

export const SuccessButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <Button ref={ref} variant="success" {...props} />);
SuccessButton.displayName = "SuccessButton";

// IconButton (Specific implementation might vary based on how icons are handled)
// This is a basic version. You might want to pass the icon as children or a specific prop.
export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { "aria-label": string }
>(({ children, icon, ...props }, ref) => (
  <Button ref={ref} {...props} icon={icon || children}>
    {!icon && children && (
      <span className="sr-only">{props["aria-label"]}</span>
    )}
  </Button>
));
IconButton.displayName = "IconButton";

// LightsOutButton Presets
const lightsOutBaseClasses =
  "transition-all duration-300 ease-out relative overflow-hidden";
const lightsOutHoverClasses = "hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)]"; // Example hover effect

export const LightsOutButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, motionProps, ...props }, ref) => {
    const customMotionProps: MotionProps = {
      whileHover: { scale: 1.05, boxShadow: "0px 0px 15px rgba(0,0,0,0.2)" },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 300, damping: 20 },
      ...motionProps,
    };

    return (
      <Button
        ref={ref}
        className={twMerge(
          lightsOutBaseClasses,
          lightsOutHoverClasses,
          className,
        )}
        motionProps={customMotionProps}
        {...props}
      />
    );
  },
);
LightsOutButton.displayName = "LightsOutButton";

export const LightsOutPrimaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <LightsOutButton ref={ref} variant="primary" {...props} />);
LightsOutPrimaryButton.displayName = "LightsOutPrimaryButton";

export const LightsOutSecondaryButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <LightsOutButton ref={ref} variant="secondary" {...props} />);
LightsOutSecondaryButton.displayName = "LightsOutSecondaryButton";

export const LightsOutSuccessButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>((props, ref) => <LightsOutButton ref={ref} variant="success" {...props} />);
LightsOutSuccessButton.displayName = "LightsOutSuccessButton";
