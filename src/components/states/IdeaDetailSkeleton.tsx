import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function IdeaDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-24 border-2 border-border/10 rounded-full" />
            <Skeleton className="h-3 w-32 border-2 border-border/10" />
          </div>
          <Skeleton className="h-10 w-3/4 border-2 border-border/20" />
          <Skeleton className="h-5 w-1/2 border-2 border-border/20" />
        </div>
        
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 border-2 border-border/20 rounded-lg shadow-hard-sm" />
          <Skeleton className="h-10 w-28 border-2 border-border/20 rounded-lg shadow-hard-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 space-y-8 border-2 border-border shadow-hard rounded-3xl">
            <div className="space-y-3">
              <Skeleton className="h-3 w-20 border-2 border-border/10" />
              <Skeleton className="h-24 w-full border-2 border-border/10 rounded-2xl" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-3 w-16 border-2 border-border/10" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 border-2 border-border/10 rounded-full" />
                <Skeleton className="h-8 w-20 border-2 border-border/10 rounded-full" />
                <Skeleton className="h-8 w-14 border-2 border-border/10 rounded-full" />
              </div>
            </div>
          </Card>

          {/* Notes Section Skeleton */}
          <Card className="p-8 space-y-6 border-2 border-border shadow-hard rounded-3xl">
            <Skeleton className="h-7 w-48 border-2 border-border/20" />
            <div className="space-y-4 pt-4 border-t-2 border-border/5">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full border-2 border-border/10 rounded-xl" />
              ))}
            </div>
            <div className="space-y-4 pt-4 border-t-2 border-border/10">
              <Skeleton className="h-24 w-full border-2 border-border/10 rounded-xl" />
              <div className="flex justify-end">
                <Skeleton className="h-9 w-28 border-2 border-border/10 rounded-lg shadow-hard-sm" />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 border-2 border-border shadow-hard-sm rounded-3xl">
            <Skeleton className="h-6 w-24 border-2 border-border/20" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-3 w-16 border-2 border-border/10" />
                  <Skeleton className="h-3 w-20 border-2 border-border/10" />
                </div>
              ))}
            </div>
          </Card>

          <Skeleton className="h-10 w-full border-2 border-border/10 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
