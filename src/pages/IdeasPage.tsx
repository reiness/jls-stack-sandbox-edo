import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { seedProductIdeas } from "@/lib/firestore/productIdeas"
import { Button } from "@/components/ui/button"
import { BadgePill } from "@/components/common/BadgePill"
import { PriorityBadge } from "@/components/common/PriorityBadge"
import { PageHeader } from "@/components/common/PageHeader"
import { useUser } from "@/lib/context/UserContext"
import { Plus, Lightbulb, Bomb, Search, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { IdeasListSkeleton } from "@/components/states/IdeasListSkeleton"
import { ErrorState } from "@/components/states/ErrorState"
import { EmptyState } from "@/components/states/EmptyState"

// New Hooks & Components
import { useIdeasFilters } from "@/features/ideas/hooks/useIdeasFilters"
import { useIdeasList } from "@/features/ideas/hooks/useIdeasList"
import { IdeasFiltersBar } from "@/features/ideas/components/IdeasFiltersBar"

const PAGE_SIZE = 3

export default function IdeasPage() {
  const navigate = useNavigate()
  const { userId } = useUser()
  const [seeding, setSeeding] = useState(false)
  const [shouldCrash, setShouldCrash] = useState(false)

  // --- New Hook-based State Management ---
  const { filters, setFilters, resetFilters } = useIdeasFilters()
  const { 
    items, 
    isLoading, 
    isLoadingMore, 
    error, 
    hasMore, 
    loadMore, 
    refresh 
  } = useIdeasList(filters, PAGE_SIZE)

  const handleSeed = async () => {
    if (!userId) {
      toast.error("Please sign in to seed data.")
      return
    }

    setSeeding(true)
    try {
      await seedProductIdeas(userId)
      toast.success("Database seeded successfully!")
      refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to seed database.")
    } finally {
      setSeeding(false)
    }
  }

  if (shouldCrash) {
    throw new Error("BOOM! This is an intentional crash to test the Error Boundary. Click 'Try to recover' or 'Reload' to fix me.")
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Product Ideas"
        subtitle="The central hub for all product innovation. Capture, refine, and prioritize your best concepts."
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSeed}
              disabled={seeding || !userId}
              variant="outline"
              size="sm"
              className="cursor-pointer border-2 border-border shadow-hard-sm hover:translate-y-[1px] hover:shadow-none transition-all rounded-lg font-bold"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {seeding ? "Seeding..." : "Seed Data"}
            </Button>
            <Button 
              asChild 
              size="sm"
              className="cursor-pointer border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide"
            >
              <Link to="/ideas/new">
                <Plus className="mr-2 h-4 w-4" />
                New Idea
              </Link>
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        <IdeasFiltersBar
          filters={filters}
          onUpdate={setFilters}
          onReset={resetFilters}
          resultsCount={items.length}
        />
        
        {/* Preserved Dev Crash Button - placed subtly below filters */}
        <div className="flex justify-end px-2">
          <Button
            variant="ghost"
            onClick={() => setShouldCrash(true)}
            className="text-[10px] font-bold text-muted-foreground hover:text-destructive h-6 px-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <Bomb className="mr-1.5 h-3 w-3" />
            Crash App (Dev Only)
          </Button>
        </div>
      </div>

      {/* States */}
      {isLoading ? (
        <IdeasListSkeleton />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={refresh}
        />
      ) : items.length === 0 ? (
        (() => {
          const isFiltered = filters.q || 
                           (filters.status && filters.status !== "all") || 
                           (filters.tag && filters.tag !== "all") || 
                           filters.archived;
          
          if (isFiltered) {
            return (
              <EmptyState
                icon={<Search className="h-12 w-12" />}
                title="No ideas match your filters"
                description="We couldn't find any ideas that match your current search or filter criteria. Try broadening your search or resetting the filters."
                actionLabel="Clear Filters"
                onAction={resetFilters}
                secondaryActionLabel="Create New Idea"
                onSecondaryAction={() => navigate("/ideas/new")}
              />
            )
          }

          return (
            <EmptyState
              icon={<Lightbulb className="h-12 w-12" />}
              title="Your Idea Box is empty"
              description="You haven't created any product ideas yet. Start by capturing your first great concept!"
              actionLabel="Create My First Idea"
              onAction={() => navigate("/ideas/new")}
              secondaryActionLabel="Seed Sample Data"
              onSecondaryAction={handleSeed}
            />
          )
        })()
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4">
            {items.map((idea) => (
              <Link 
                key={idea.id} 
                to={`/ideas/${idea.id}`}
                className="block group"
              >
                <div className="bg-card border-2 border-border shadow-hard-sm rounded-xl p-5 transition-all group-hover:translate-y-[-2px] group-hover:shadow-hard group-active:translate-y-[2px] group-active:shadow-none">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h4 className="font-black text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {idea.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                        {idea.summary}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground pt-1">
                        <span className={
                          idea.status === 'active' ? 'text-primary' :
                          idea.status === 'shipped' ? 'text-green-600' :
                          idea.status === 'paused' ? 'text-orange-500' : ''
                        }>
                          Status: {idea.status}
                        </span>
                        <span>•</span>
                        <span>Created: {idea.createdAt?.toDate().toLocaleDateString() ?? 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                      <div className="flex flex-wrap justify-end gap-2">
                        <PriorityBadge priority={idea.priority} />
                        {(idea.tags ?? []).slice(0, 3).map((t) => (
                          <BadgePill key={t} label={t} variant="secondary" />
                        ))}
                        {(idea.tags?.length ?? 0) > 3 && (
                          <span className="text-[10px] font-bold text-muted-foreground py-1">
                            +{idea.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center pt-6">
            <Button
              onClick={loadMore}
              disabled={!hasMore || isLoadingMore}
              className="bg-white text-foreground border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide px-8"
            >
              {isLoadingMore ? "Loading..." : hasMore ? "Load More Ideas" : "No more results"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
