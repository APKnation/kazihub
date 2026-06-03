import { cn } from './Button';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-card/50', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-16 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
