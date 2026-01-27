import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState() {
  return (
    <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full border-2 border-border" />
        <div className="space-y-3 text-left">
          <Skeleton className="h-6 w-[250px] border-2 border-border" />
          <Skeleton className="h-4 w-[200px] border-2 border-border" />
        </div>
      </div>
      <p className="text-lg text-muted-foreground font-black animate-pulse uppercase tracking-widest">
        Fetching Goodies...
      </p>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-card border-2 border-border shadow-hard-sm rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4 flex-1">
          <Skeleton className="h-7 w-3/4 border-2 border-border/50" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full border-2 border-border/50" />
            <Skeleton className="h-4 w-5/6 border-2 border-border/50" />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Skeleton className="h-3 w-20 border-2 border-border/50" />
            <Skeleton className="h-3 w-32 border-2 border-border/50" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 min-w-[120px]">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
