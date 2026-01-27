import { useEffect, useMemo, useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { fetchIdeasPage, type IdeaListFilters, type ProductIdea, seedProductIdeas, type IdeaListStatus } from "@/lib/firestore/productIdeas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BadgePill } from "@/components/common/BadgePill"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/common/PageHeader"
import { useUser } from "@/lib/context/UserContext"
import { useRealTime } from "@/lib/context/RealTimeContext"
import { type QueryDocumentSnapshot, type DocumentData } from "firebase/firestore"
import { RotateCcw, Search, Filter, Plus, X, Lightbulb, Bomb } from "lucide-react"
import { sleep } from "@/lib/utils"
import { toast } from "sonner"
import { IdeasListSkeleton } from "@/components/states/IdeasListSkeleton"
import { ErrorState } from "@/components/states/ErrorState"
import { EmptyState } from "@/components/states/EmptyState"

const PAGE_SIZE = 3

function getParam(sp: URLSearchParams, key: string, fallback = "") {
  const v = sp.get(key)
  return v ?? fallback
}

export default function IdeasPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { userId } = useUser()
  const { setStatus } = useRealTime()
  const [refreshKey, setRefreshKey] = useState(0)
  const [shouldCrash, setShouldCrash] = useState(false)

  // --- URL-backed filter state (source of truth) ---
  const filters: IdeaListFilters = useMemo(() => {
    const q = getParam(searchParams, "q", "")
    const status = getParam(searchParams, "status", "all")
    const tag = getParam(searchParams, "tag", "all")
    const archivedParam = getParam(searchParams, "archived", "false")
    const archived = archivedParam === "true"

    return {
      q,
      status: status as IdeaListStatus,
      tag: tag === "all" ? "" : tag,
      archived,
    }
  }, [searchParams])

  // --- UI state ---
  const [items, setItems] = useState<ProductIdea[]>([])
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  const hasMore = cursor != null

  // Local input state (so typing feels good) + debounce into URL param
  const [qInput, setQInput] = useState(filters.q ?? "")

  useEffect(() => {
    setQInput(filters.q ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q])

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      const trimmed = qInput.trim()

      if (trimmed) next.set("q", trimmed)
      else next.delete("q")

      setSearchParams(next, { replace: true })
    }, 300)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput])

  // Load first page when filters change (except qInput typing; URL drives reload)
  useEffect(() => {
    let alive = true

    async function run() {
      setLoading(true)
      setError(null)
      await sleep(1000) // For dev: ensure skeletons are visible

      try {
        const res = await fetchIdeasPage({
          filters,
          pageSize: PAGE_SIZE,
          cursor: null,
        })

        if (!alive) return
        setItems(res.items)
        setCursor(res.nextCursor)
        setStatus("active")
      } catch (e) {
        console.error(e)
        if (!alive) return
        setError("Failed to load ideas. If Firestore asks for an index, create it and retry.")
        setStatus("error")
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    run()
    return () => {
      alive = false
      setStatus("off")
    }
  }, [filters.archived, filters.status, filters.tag, filters.q, setStatus, refreshKey])

  async function onLoadMore() {
    if (!cursor) return
    setLoadingMore(true)
    setError(null)

    try {
      const res = await fetchIdeasPage({
        filters,
        pageSize: PAGE_SIZE,
        cursor,
      })

      setItems((prev) => [...prev, ...res.items])
      setCursor(res.nextCursor)
    } catch (e) {
      console.error(e)
      setError("Failed to load more ideas.")
    } finally {
      setLoadingMore(false)
    }
  }

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (!value || value === "all") next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  function toggleArchived() {
    const next = new URLSearchParams(searchParams)
    const isArchived = getParam(next, "archived", "false") === "true"
    next.set("archived", (!isArchived).toString())
    setSearchParams(next, { replace: true })
  }

  function handleReset() {
    setSearchParams(new URLSearchParams(), { replace: true })
    setQInput("")
  }

  const handleSeed = async () => {
    if (!userId) {
      alert("Please sign in to seed data.")
      return
    }

    setSeeding(true)
    try {
      await seedProductIdeas(userId)
      toast.success("Database seeded successfully!")
      // Force refresh by reloading first page
      const res = await fetchIdeasPage({
          filters,
          pageSize: PAGE_SIZE,
          cursor: null,
        })
      setItems(res.items)
      setCursor(res.nextCursor)
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
        subtitle="Browse, filter, and manage product ideas submitted by the team."
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

      {/* Controls Card */}
      <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Search title (starts with...)"
              className="pl-9 pr-20 border-2 border-border shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground hidden sm:block">
              Prefix Only
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Select
                value={filters.status ?? "all"}
                onValueChange={(v) => setParam("status", v)}
            >
                <SelectTrigger className="w-[160px] border-2 border-border shadow-sm font-bold">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.tag ? filters.tag : "all"}
                onValueChange={(v) => setParam("tag", v)}
            >
                <SelectTrigger className="w-[160px] border-2 border-border shadow-sm font-bold">
                    <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All tags</SelectItem>
                    {/* Add common tags */}
                    <SelectItem value="ux">ux</SelectItem>
                    <SelectItem value="backend">backend</SelectItem>
                    <SelectItem value="performance">performance</SelectItem>
                    <SelectItem value="ai">ai</SelectItem>
                    <SelectItem value="design">design</SelectItem>
                    <SelectItem value="mobile">mobile</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/10">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={toggleArchived}
              className="text-xs font-bold text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <Filter className="mr-2 h-3 w-3" />
              {filters.archived ? "Showing: Archived" : "Showing: Active"}
            </Button>

            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-xs font-bold text-muted-foreground hover:text-destructive h-8 px-2"
            >
              <X className="mr-2 h-3 w-3" />
              Reset Filters
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShouldCrash(true)}
              className="text-xs font-bold text-muted-foreground hover:text-destructive h-8 px-2"
            >
              <Bomb className="mr-2 h-3 w-3" />
              Crash App (Dev Only)
            </Button>
          </div>

          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {items.length > 0 && `Showing ${items.length} results • `}
            Filters sync to URL
          </div>
        </div>
      </div>

      {/* States */}
      {loading ? (
        <IdeasListSkeleton />
      ) : error ? (
        <ErrorState
            message={error}
            onRetry={() => setRefreshKey(k => k + 1)}
        />
      ) : items.length === 0 ? (
        (() => {
          const isFiltered = filters.q || (filters.status && filters.status !== "all") || (filters.tag && filters.tag !== "all") || filters.archived;
          
          if (isFiltered) {
            return (
              <EmptyState
                icon={<Search className="h-12 w-12" />}
                title="No ideas match your filters"
                description="We couldn't find any ideas that match your current search or filter criteria. Try broadening your search or resetting the filters."
                actionLabel="Clear Filters"
                onAction={handleReset}
                secondaryActionLabel="Create New Idea"
                onSecondaryAction={() => navigate("/ideas/new")}
              />
            );
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
          );
        })()
      ) : (
        <div className="space-y-4">
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
                            <p className="text-sm text-muted-foreground font-medium line-clamp-2 pr-8">
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

          <div className="flex justify-center pt-6">
            <Button
              onClick={onLoadMore}
              disabled={!hasMore || loadingMore}
              className="bg-white text-foreground border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide px-8"
            >
              {loadingMore ? "Loading..." : hasMore ? "Load More Ideas" : "No more results"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
