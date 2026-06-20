import { forwardRef } from 'react';
import { cn } from './Button';

const Card = forwardRef(({ className, glass = false, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-md border border-hairline bg-canvas-soft overflow-hidden transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
    {children}
  </div>
);
CardHeader.displayName = 'CardHeader';

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-[24px] font-semibold leading-[32px] tracking-[-0.6px] text-ink-strong', className)} {...props}>
    {children}
  </h3>
);
CardTitle.displayName = 'CardTitle';

const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0 text-body text-[16px]', className)} {...props}>
    {children}
  </div>
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
