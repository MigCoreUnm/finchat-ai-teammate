import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles: Inset shadow for depth and softer corners
          "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-inner shadow-blue-900/5 border-blue-200/60 transition-all duration-200 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium",
          
          // Placeholder styles to match the new theme
          "placeholder:text-blue-400/80",
          
          // Focus state: A sharper border and a soft outer glow
          "focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20",
          
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }