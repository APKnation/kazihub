import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-primary/30',
    secondary: 'bg-card text-foreground hover:bg-border border border-border',
    accent: 'bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg hover:shadow-accent/30',
    ghost: 'hover:bg-card hover:text-foreground text-foreground/80'
  };

  const sizes = {
    default: 'h-11 px-6 py-2',
    sm: 'h-9 px-4 text-sm',
    lg: 'h-14 px-8 text-lg'
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export { Button };
