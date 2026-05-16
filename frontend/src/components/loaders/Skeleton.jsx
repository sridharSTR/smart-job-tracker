export function Skeleton({ className = "h-6 w-full" }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800 ${className}`} />;
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div className="glass rounded-xl p-5" key={index}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-9 w-20" />
          <Skeleton className="mt-5 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

