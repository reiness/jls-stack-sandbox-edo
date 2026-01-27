import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function IdeasListSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header-ish skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 border-2 border-border/20" />
          <Skeleton className="h-4 w-96 border-2 border-border/20" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 border-2 border-border/20 rounded-lg" />
          <Skeleton className="h-10 w-32 border-2 border-border/20 rounded-lg" />
        </div>
      </div>

      {/* Filters-ish skeleton */}
      <Card className="p-6 space-y-4 border-2 border-border shadow-hard rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-12 md:col-span-2 border-2 border-border/10 rounded-lg" />
          <Skeleton className="h-12 border-2 border-border/10 rounded-lg" />
          <Skeleton className="h-12 border-2 border-border/10 rounded-lg" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/5">
          <div className="flex gap-4">
            <Skeleton className="h-8 w-32 border-2 border-border/10 rounded-lg" />
            <Skeleton className="h-8 w-32 border-2 border-border/10 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-48 border-2 border-border/10" />
        </div>
      </Card>

      {/* List item skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 space-y-4 border-2 border-border shadow-hard-sm rounded-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-7 w-1/3 border-2 border-border/10" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full border-2 border-border/10" />
                  <Skeleton className="h-4 w-2/3 border-2 border-border/10" />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Skeleton className="h-3 w-20 border-2 border-border/10" />
                  <Skeleton className="h-3 w-32 border-2 border-border/10" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 min-w-[120px]">
                <div className="flex flex-wrap justify-end gap-2">
                  <Skeleton className="h-6 w-12 rounded-full border-2 border-border/10" />
                  <Skeleton className="h-6 w-12 rounded-full border-2 border-border/10" />
                  <Skeleton className="h-6 w-12 rounded-full border-2 border-border/10" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Footer-ish skeleton */}
      <div className="flex justify-center pt-6">
        <Skeleton className="h-12 w-48 border-2 border-border/10 rounded-lg shadow-hard-sm" />
      </div>
    </div>
  )
}
