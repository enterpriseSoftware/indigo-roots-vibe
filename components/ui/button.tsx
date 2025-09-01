import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      default: 'bg-foreground text-background hover:bg-foreground/90',
      primary: 'bg-indigo-blue text-white hover:bg-indigo-blue/90',
      secondary: 'bg-earthy-brown text-white hover:bg-earthy-brown/90',
      destructive: 'bg-red-500 text-white hover:bg-red-500/90',
      outline:
        'border border-indigo-blue text-indigo-blue hover:bg-indigo-blue hover:text-white',
      ghost: 'hover:bg-indigo-blue/10 hover:text-indigo-blue',
    }

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
