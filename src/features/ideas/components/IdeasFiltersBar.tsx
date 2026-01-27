import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { IdeaListFilters, IdeaListStatus } from "@/lib/firestore/productIdeas"

interface IdeasFiltersBarProps {
  filters: Required<IdeaListFilters>
  onUpdate: (updates: Partial<IdeaListFilters>) => void
  onReset: () => void
  resultsCount?: number
}

export function IdeasFiltersBar({
  filters,
  onUpdate,
  onReset,
  resultsCount,
}: IdeasFiltersBarProps) {
  const [qInput, setQInput] = useState(filters.q)
  const [prevFiltersQ, setPrevFiltersQ] = useState(filters.q)

  // Sync local state with prop (for external resets/updates)
  if (filters.q !== prevFiltersQ) {
    setPrevFiltersQ(filters.q)
    setQInput(filters.q)
  }

  // Debounced search update
  useEffect(() => {
    // Only update if the local input differs from the active filter
    if (qInput === filters.q) return

    const timer = setTimeout(() => {
      onUpdate({ q: qInput })
    }, 500)

    return () => clearTimeout(timer)
  }, [qInput, filters.q, onUpdate])

  return (
    <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-6 space-y-6">
      {/* Top Tier: Search and Selects */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            className="pl-10 pr-10 h-11 rounded-xl border-2 transition-all focus:ring-4 focus:ring-primary/10"
          />
          {qInput && (
            <button
              onClick={() => {
                setQInput("")
                onUpdate({ q: "" })
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={(v) => onUpdate({ status: v as IdeaListStatus })}
            >
              <SelectTrigger className="w-[140px] h-11 border-2 rounded-xl bg-background font-medium">
                <SelectValue placeholder="Status" />
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

          <div className="flex items-center gap-2">
            <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Tag
            </Label>
            <Select
              value={filters.tag || "all"}
              onValueChange={(v) => onUpdate({ tag: v })}
            >
              <SelectTrigger className="w-[140px] h-11 border-2 rounded-xl bg-background font-medium">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="ux">UX</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bottom Tier: Auxiliary actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-border/50">
        <div className="flex items-center gap-8">
          <div className="flex items-center space-x-3">
            <Switch
              id="archived-filter"
              checked={filters.archived}
              onCheckedChange={(checked) => onUpdate({ archived: checked })}
            />
            <Label
              htmlFor="archived-filter"
              className="cursor-pointer font-bold text-sm select-none"
            >
              Show Archived
            </Label>
          </div>

          {resultsCount !== undefined && (
            <div className="px-3 py-1 bg-accent/50 rounded-full border border-border/50">
              <span className="text-xs font-bold text-muted-foreground">
                {resultsCount} {resultsCount === 1 ? "IDEA" : "IDEAS"} FOUND
              </span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 gap-2 text-muted-foreground hover:text-foreground font-bold rounded-xl hover:bg-accent/50"
        >
          <X className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
