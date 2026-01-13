import { useEffect, useState, useCallback } from "react"
import { getProductIdeasPaginated, getProductIdeaNotes, createProductIdeaNote, deleteProductIdeaNote } from "@/lib/firestore/productIdeas"
import type { ProductIdeaFilters, ProductIdeaCursor } from "@/lib/firestore/productIdeas"
import type { ProductIdea, ProductIdeaStatus, ProductIdeaNote } from "@/types/productIdeas"
import { SectionCard } from "../common/SectionCard"
import { EmptyState } from "../common/EmptyState"
import { BadgePill } from "../common/BadgePill"
import { InlineAlert } from "../common/InlineAlert"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { X, Trash2 } from "lucide-react"
import { useUser } from "@/lib/context/UserContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog"
import { CreateIdeaDialog } from "./CreateIdeaDialog"
import { EditIdeaDialog } from "./EditIdeaDialog"
import { deleteProductIdea } from "@/lib/firestore/productIdeas"

export function IdeasList() {
  const { userId, userLabel } = useUser()
  const [ideas, setIdeas] = useState<ProductIdea[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<ProductIdea | null>(null)
  const [notes, setNotes] = useState<ProductIdeaNote[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Note creation state
  const [newNote, setNewNote] = useState("")
  const [submittingNote, setSubmittingNote] = useState(false)
  
  // Filter State
  const [statusFilter, setStatusFilter] = useState<ProductIdeaStatus | "all">("all")
  const [tagFilter, setTagFilter] = useState("")

  const clearFilters = () => {
    setStatusFilter("all")
    setTagFilter("")
  }

  const removeStatusFilter = () => setStatusFilter("all")
  const removeTagFilter = () => setTagFilter("")
  
  // Pagination State
  const [lastDoc, setLastDoc] = useState<ProductIdeaCursor | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const fetchIdeas = useCallback(async (isLoadMore = false) => {
    if (!userId) return

    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setIdeas([])
    }
    
    setError(null)
    
    try {
      const filters: ProductIdeaFilters = { ownerId: userId }
      if (statusFilter !== "all") filters.status = statusFilter
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
  }, [statusFilter, tagFilter, lastDoc, userId])

  useEffect(() => {
    if (userId) {
      setLastDoc(null)
      fetchIdeas(false)
    }
  }, [statusFilter, tagFilter, userId])

  const fetchNotes = useCallback(async (ideaId: string) => {
    try {
      const fetchedNotes = await getProductIdeaNotes(ideaId)
      setNotes(fetchedNotes)
    } catch (err) {
      console.error("Error fetching notes:", err)
    }
  }, [])

  useEffect(() => {
    if (selectedIdea) {
      fetchNotes(selectedIdea.id)
    } else {
      setNotes([])
      setNewNote("") // Reset note input
    }
  }, [selectedIdea, fetchNotes])

  const handleAddNote = async () => {
    if (!selectedIdea || !newNote.trim() || !userId) return

    setSubmittingNote(true)
    try {
      await createProductIdeaNote(selectedIdea.id, {
        body: newNote,
        authorId: userId
      })
      setNewNote("")
      // Refresh notes
      await fetchNotes(selectedIdea.id)
    } catch (err) {
      console.error("Error creating note:", err)
      alert("Failed to add note.")
    } finally {
      setSubmittingNote(false)
    }
  }

  const handleDeleteIdea = async (ideaId: string) => {
    if (!window.confirm("Are you sure you want to delete this idea? This action cannot be undone.")) return

    try {
      await deleteProductIdea(ideaId)
      setSelectedIdea(null)
      fetchIdeas(false)
    } catch (err) {
      console.error("Error deleting idea:", err)
      alert("Failed to delete idea.")
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedIdea || !userId) return
    if (!window.confirm("Are you sure you want to delete this note?")) return

    try {
      await deleteProductIdeaNote(selectedIdea.id, noteId)
      await fetchNotes(selectedIdea.id)
    } catch (err) {
      console.error("Error deleting note:", err)
      alert("Failed to delete note.")
    }
  }

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
        <div className="space-y-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              onClick={() => setSelectedIdea(idea)}
              className="bg-card border-2 border-border shadow-hard-sm rounded-xl p-4 transition-all hover:translate-y-[-2px] hover:shadow-hard cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-black text-lg text-foreground tracking-tight">{idea.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                    {idea.summary}
                  </p>
                  <div className="text-[10px] text-muted-foreground flex gap-2 font-bold uppercase tracking-wide">
                    <span>Owner: {userLabel}</span>
                    {idea.assigneeId && <span>• Assignee: {idea.assigneeId}</span>}
                    <span>• Created: {idea.createdAt.toDate().toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {idea.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation()
                          setTagFilter(tag)
                        }}
                        className="hover:opacity-80 transition-opacity"
                      >
                        <BadgePill label={tag} variant="secondary" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <BadgePill
                    label={idea.status.toUpperCase()}
                    variant={
                      idea.status === "shipped" ? "success" :
                      idea.status === "active" ? "primary" :
                      idea.status === "paused" ? "warning" :
                      "outline"
                    }
                  />
                  {idea.priority && (
                    <BadgePill
                      label={idea.priority.toUpperCase()}
                      variant={
                        idea.priority === "high" ? "destructive" :
                        idea.priority === "medium" ? "info" :
                        "outline"
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              variant="default"
              size="default"
              onClick={() => fetchIdeas(true)}
              disabled={loadingMore}
              className="w-full border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all rounded-lg font-black tracking-wide"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-6">
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
            <label className="text-xs font-bold uppercase text-muted-foreground">Tag</label>
            <Input 
              placeholder="analytics..." 
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="cursor-pointer border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all font-black tracking-wide"
          >
            Create Idea
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchIdeas(false)}
            disabled={loading || loadingMore}
            className="cursor-pointer border-2 border-border shadow-hard-sm hover:translate-y-[1px] hover:shadow-none transition-all rounded-lg font-bold bg-accent text-accent-foreground"
          >
            {loading ? "Refreshing..." : "Refresh List"}
          </Button>
        </div>

        {(statusFilter !== "all" || tagFilter.trim()) && (
          <div className="flex flex-wrap items-center gap-2 p-4 bg-background border-2 border-border shadow-hard-sm rounded-lg">
            <span className="text-[10px] font-black uppercase text-foreground mr-1">Active Filters:</span>
            
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border-2 border-border shadow-sm rounded-md text-xs font-bold">
                Status: {statusFilter}
                <button onClick={removeStatusFilter} className="hover:text-destructive transition-colors">
                  <X size={12} className="stroke-[3]" />
                </button>
              </span>
            )}

            {tagFilter.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border-2 border-border shadow-sm rounded-md text-xs font-bold">
                Tag: {tagFilter}
                <button onClick={removeTagFilter} className="hover:text-destructive transition-colors">
                  <X size={12} className="stroke-[3]" />
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-[10px] font-bold text-muted-foreground hover:text-foreground underline ml-auto transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {renderContent()}
      </div>

      <CreateIdeaDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => fetchIdeas(false)}
      />

      <EditIdeaDialog
        idea={selectedIdea}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={() => {
          // If we are currently showing details for the idea we just edited,
          // we might want to refresh the detail view or just close it.
          // For simplicity, let's close the detail view and refresh the list.
          setSelectedIdea(null)
          fetchIdeas(false)
        }}
      />

      <Dialog open={!!selectedIdea} onOpenChange={(open) => !open && setSelectedIdea(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4 pr-8">
              <DialogTitle className="text-2xl font-black">{selectedIdea?.title}</DialogTitle>
              <div className="flex items-center gap-2">
                {selectedIdea && (
                  <BadgePill
                    label={selectedIdea.status.toUpperCase()}
                    variant={
                      selectedIdea.status === "shipped" ? "success" :
                      selectedIdea.status === "active" ? "primary" :
                      selectedIdea.status === "paused" ? "warning" :
                      "outline"
                    }
                  />
                )}
                {selectedIdea?.priority && (
                  <BadgePill
                    label={selectedIdea.priority.toUpperCase()}
                    variant={
                      selectedIdea.priority === "high" ? "destructive" :
                      selectedIdea.priority === "medium" ? "info" :
                      "outline"
                    }
                  />
                )}
              </div>
            </div>
            <DialogDescription className="text-base font-medium pt-2">
              {selectedIdea?.summary}
            </DialogDescription>
          </DialogHeader>

          {selectedIdea && (
            <div className="flex gap-2 py-2 border-b-2 border-border/10 mb-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => setIsEditOpen(true)}
                className="h-8 text-xs font-bold border-2 border-border shadow-hard-sm hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                Edit Idea
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteIdea(selectedIdea.id)}
                className="h-8 text-xs font-bold border-2 border-border shadow-hard-sm hover:translate-y-[1px] hover:shadow-none transition-all bg-destructive text-destructive-foreground"
              >
                Delete Idea
              </Button>
            </div>
          )}

          {selectedIdea && (
            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Meta</span>
                <div className="flex flex-col">
                  <span>Owner: {userLabel}</span>
                  <span>Created: {selectedIdea.createdAt.toDate().toLocaleDateString()}</span>
                  {selectedIdea.assigneeId && <span>Assignee: {selectedIdea.assigneeId}</span>}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.tags.map(tag => (
                    <BadgePill key={tag} label={tag} variant="secondary" />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border-t-2 border-border pt-4 mt-2 space-y-4">
            <h4 className="font-bold">Notes & Feedback</h4>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Add a new note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={submittingNote}
                className="min-h-[80px]"
              />
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  onClick={handleAddNote} 
                  disabled={submittingNote || !newNote.trim()}
                  variant="default"
                  className="cursor-pointer border-2 border-border shadow-hard-sm hover:translate-y-[1px] hover:shadow-none transition-all font-bold"
                >
                  {submittingNote ? "Adding..." : "Add Note"}
                </Button>
              </div>
            </div>

            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <div key={note.id} className="bg-muted/30 p-3 rounded-lg border border-border/50 text-sm group relative">
                    <p className="pr-6">{note.body}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] text-muted-foreground">
                        {note.createdAt.toDate().toLocaleDateString()}
                      </p>
                      {note.authorId === userId && (
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete note"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setSelectedIdea(null)} variant="secondary">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionCard>
  )
}
