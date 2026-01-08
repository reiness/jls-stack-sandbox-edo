import { useEffect, useState, useCallback } from "react"
import { getFilteredProductIdeas } from "@/lib/firestore/productIdeas"
import type { ProductIdea, ProductIdeaStatus } from "@/types/productIdeas"
import { SectionCard } from "../common/SectionCard"
import { EmptyState } from "../common/EmptyState"
import { BadgePill } from "../common/BadgePill"
import { InlineAlert } from "../common/InlineAlert"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function IdeasList() {
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<ProductIdeaStatus | "all">("all")

  const fetchIdeas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const filters = statusFilter !== "all" ? { status: statusFilter } : {}
      const data = await getFilteredProductIdeas(filters)
      setIdeas(data)
    } catch (err) {
      console.error("Error fetching ideas:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch ideas")
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

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
        </div>
      )
    }

    if (ideas.length === 0) {
      return (
        <EmptyState
          title="No Ideas Found"
          description={statusFilter !== "all" 
            ? `No ideas found with status "${statusFilter}".`
            : "The productIdeas collection is currently empty. Use the seed tool above to add sample data."
          }
        />
      )
    }

    return (
      <div className="divide-y">
        {ideas.map((idea) => (
          <div key={idea.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">{idea.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {idea.summary}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {idea.tags.map((tag) => (
                    <BadgePill key={tag} label={tag} tone="subtle" />
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
    )
  }

  return (
    <SectionCard 
      title="Product Ideas" 
      description={statusFilter !== "all" 
        ? `Showing ${ideas.length} "${statusFilter}" ideas.`
        : `Showing all ${ideas.length} ideas from the database.`
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by Status:</span>
            <Select 
              value={statusFilter} 
              onValueChange={(val) => setStatusFilter(val as any)}
            >
              <SelectTrigger className="w-[140px]">
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

          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchIdeas} 
            disabled={loading}
          >
            {loading ? "Fetching..." : "Refresh List"}
          </Button>
        </div>
        {renderContent()}
      </div>
    </SectionCard>
  )
}
