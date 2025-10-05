import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // Add mobile-optimized attributes for number inputs
    const numberInputProps = type === 'number' ? {
      inputMode: 'numeric' as const,
      pattern: '[0-9]*'
    } : {};
    
    return (
      <input
        type={type}
        className={cn(
          // Base styles with better mobile touch targets
          "flex min-h-[48px] w-full rounded-md border-2 border-gray-300 bg-white px-4 py-3",
          // Typography - 16px minimum to prevent zoom on iOS
          "text-base font-medium sm:text-sm",
          // Focus and interaction states
          "ring-offset-white placeholder:text-gray-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "focus:border-primary transition-colors",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Touch feedback
          "tap-highlight",
          className
        )}
        ref={ref}
        {...numberInputProps}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

