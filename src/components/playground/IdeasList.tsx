import { useEffect, useState, useCallback } from "react"
import { getProductIdeasPaginated } from "@/lib/firestore/productIdeas"
import type { ProductIdeaFilters } from "@/lib/firestore/productIdeas"
import type { ProductIdea, ProductIdeaStatus } from "@/types/productIdeas"
import type { DocumentSnapshot } from "firebase/firestore"
import { SectionCard } from "../common/SectionCard"
import { EmptyState } from "../common/EmptyState"
import { BadgePill } from "../common/BadgePill"
import { InlineAlert } from "../common/InlineAlert"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { X } from "lucide-react"

export function IdeasList() {
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filter State
  const [statusFilter, setStatusFilter] = useState<ProductIdeaStatus | "all">("all")
  const [ownerFilter, setOwnerFilter] = useState("")
  const [tagFilter, setTagFilter] = useState("")

  const clearFilters = () => {
    setStatusFilter("all")
    setOwnerFilter("")
    setTagFilter("")
  }

  const removeStatusFilter = () => setStatusFilter("all")
  const removeOwnerFilter = () => setOwnerFilter("")
  const removeTagFilter = () => setTagFilter("")
  
  // Pagination State
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const fetchIdeas = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setIdeas([]) 
    }
    
    setError(null)
    
    try {
      const filters: ProductIdeaFilters = {}
      if (statusFilter !== "all") filters.status = statusFilter
      if (ownerFilter.trim()) filters.ownerId = ownerFilter.trim()
      if (tagFilter.trim()) filters.tag = tagFilter.trim()

      const result = await getProductIdeasPaginated(5, isLoadMore ? (lastDoc ?? undefined) : undefined, filters)
      
      setIdeas(prev => isLoadMore ? [...prev, ...result.ideas] : result.ideas)
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (err) {
      console.error("Error fetching ideas:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch ideas")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [statusFilter, ownerFilter, tagFilter, lastDoc])

  useEffect(() => {
    setLastDoc(null)
    fetchIdeas(false)
  }, [statusFilter, ownerFilter, tagFilter])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="animate-pulse">Fetching from Firestore...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="p-4">
          <InlineAlert 
            tone="danger" 
            title="Error Fetching Data" 
            message={error} 
          />
          <p className="text-xs text-muted-foreground mt-2 px-1 italic">
            Note: Multi-field filtering might require a Firestore index. Check the console for an auto-generation link if the query fails.
          </p>
        </div>
      )
    }

    if (ideas.length === 0) {
      return (
        <EmptyState
          title="No Ideas Found"
          description="Try adjusting your filters or use the seed tool above to add sample data."
        />
      )
    }

    return (
      <div className="space-y-6">
        <div className="divide-y">
          {ideas.map((idea) => (
            <div key={idea.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">{idea.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {idea.summary}
                  </p>
                  <div className="text-[10px] text-muted-foreground flex gap-2">
                    <span>Owner: {idea.ownerId}</span>
                    {idea.assigneeId && <span>• Assignee: {idea.assigneeId}</span>}
                    <span>• Created: {idea.createdAt.toDate().toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {idea.tags.map((tag) => (
                      <button 
                        key={tag} 
                        onClick={() => setTagFilter(tag)}
                        className="hover:opacity-80 transition-opacity"
                      >
                        <BadgePill label={tag} tone="subtle" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <BadgePill 
                    label={idea.status.toUpperCase()} 
                    tone={idea.status === "shipped" ? "default" : "subtle"} 
                  />
                  {idea.priority && (
                    <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {idea.priority}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center pt-4 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => fetchIdeas(true)} 
              disabled={loadingMore}
              className="text-primary hover:text-primary hover:bg-primary/5 font-semibold"
            >
              {loadingMore ? "Loading more..." : "Load More Ideas"}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <SectionCard 
      title="Product Ideas" 
      description="Experiment with multi-field Firestore queries and pagination."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
            <Select 
              value={statusFilter} 
              onValueChange={(val: ProductIdeaStatus | "all") => setStatusFilter(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Owner ID</label>
            <Input 
              placeholder="user-123..." 
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Tag</label>
            <Input 
              placeholder="analytics..." 
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchIdeas(false)} 
            disabled={loading || loadingMore}
          >
            {loading ? "Refreshing..." : "Refresh List"}
          </Button>
        </div>

        {(statusFilter !== "all" || ownerFilter.trim() || tagFilter.trim()) && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border border-dashed border-border/60">
            <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1">Active Filters:</span>
            
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border rounded text-xs">
                Status: {statusFilter}
                <button onClick={removeStatusFilter} className="hover:text-destructive">
                  <X size={10} />
                </button>
              </span>
            )}

            {ownerFilter.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border rounded text-xs">
                Owner: {ownerFilter}
                <button onClick={removeOwnerFilter} className="hover:text-destructive">
                  <X size={10} />
                </button>
              </span>
            )}

            {tagFilter.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border rounded text-xs">
                Tag: {tagFilter}
                <button onClick={removeTagFilter} className="hover:text-destructive">
                  <X size={10} />
                </button>
              </span>
            )}

            <button 
              onClick={clearFilters}
              className="text-[10px] text-muted-foreground hover:text-foreground underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {renderContent()}
      </div>
    </SectionCard>
  )
}
