import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// A simple SVG spinner for the loading state
const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-current"
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
);

const buttonVariants = cva(
  // Base styles for all buttons
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // The primary, high-impact call-to-action
        primary:
          "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5",
        // A less prominent button for secondary actions
        secondary:
          "bg-white text-blue-700 border border-blue-200/80 shadow-md shadow-blue-500/10 hover:bg-blue-50/80 hover:-translate-y-0.5",
        // Destructive actions with added depth
        destructive:
          "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:-translate-y-0.5",
        outline:
          "border border-blue-300 bg-transparent text-blue-600 hover:bg-blue-500/10",
        ghost: "hover:bg-blue-100/80 hover:text-blue-800",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      shape: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, isLoading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    // Use 'primary' as the default if 'variant' is not provided
    const effectiveVariant = variant || "primary";

    return (
      <Comp
        className={cn(buttonVariants({ variant: effectiveVariant, size, shape, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }