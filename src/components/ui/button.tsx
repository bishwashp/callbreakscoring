import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles with better touch feedback
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "touch-active tap-highlight",
          // Variant styles
          {
            "bg-primary text-white hover:bg-primary-700 active:bg-primary-800": variant === "default",
            "border-2 border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100": variant === "outline",
            "hover:bg-gray-100 active:bg-gray-200": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 active:bg-red-700": variant === "destructive",
          },
          // Size styles - Mobile-first with min 48px touch targets
          {
            "min-h-[48px] px-4 py-3 text-base sm:min-h-[44px] sm:py-2 sm:text-sm": size === "default",
            "min-h-[44px] px-3 py-2 text-sm": size === "sm",
            "min-h-[56px] px-6 py-4 text-lg sm:min-h-[48px] sm:px-8 sm:py-3": size === "lg",
            "min-h-[48px] min-w-[48px] p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

