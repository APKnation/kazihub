import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none tracking-wide';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-soft',
    secondary: 'bg-canvas text-ink hover:bg-canvas-soft border border-hairline',
    outline: 'bg-canvas text-ink hover:bg-canvas-soft border border-hairline',
    ghost: 'hover:bg-canvas-soft text-primary hover:text-primary-soft',
  };

  const sizes = {
    default: 'h-10 px-4 py-2 text-[16px]',
    sm: 'h-8 px-3 text-[14px]',
    lg: 'h-12 px-6 text-[16px]',
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
