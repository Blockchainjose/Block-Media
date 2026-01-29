import { Skeleton } from "./ui/skeleton";

interface NewsCardSkeletonProps {
  featured?: boolean;
}

export function NewsCardSkeleton({ featured = false }: NewsCardSkeletonProps) {
  if (featured) {
    return (
      <div className="rounded-2xl overflow-hidden bg-card border border-border">
        <div className="grid md:grid-cols-2 gap-0">
          <Skeleton className="h-64 md:h-80" />
          <div className="p-6 md:p-8 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
