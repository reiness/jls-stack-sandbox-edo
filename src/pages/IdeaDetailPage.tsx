// Feature: ideas-detail-header
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BadgePill } from "@/components/common/BadgePill"
import { InlineAlert } from "@/components/common/InlineAlert"
import { updateIdea, archiveIdea } from "@/lib/firestore/productIdeas"
import { addIdeaNote } from "@/lib/firestore/ideaNotes"
import { useUser } from "@/lib/context/UserContext"
import { STATUS_OPTIONS, type ProductIdeaStatus } from "@/types/productIdeas"
import { toast } from "sonner"
import { EmptyState } from "@/components/states/EmptyState"
import { MessageSquarePlus } from "lucide-react"
import { IdeaDetailSkeleton } from "@/components/states/IdeaDetailSkeleton"
import { ErrorState } from "@/components/states/ErrorState"
import { useIdea } from "@/features/ideas/hooks/useIdea"
import { useIdeaNotes } from "@/features/ideas/hooks/useIdeaNotes"

export default function IdeaDetailPage() {
  const { ideaId } = useParams()
  const navigate = useNavigate()
  const { userId } = useUser()
  
  const { idea, loading: ideaLoading, error: ideaError } = useIdea(ideaId)
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editSummary, setEditSummary] = useState("")
  const [editStatus, setEditStatus] = useState<ProductIdeaStatus>("draft")
  const [editTags, setEditTags] = useState("")
  const [saving, setSaving] = useState(false)

  // Notes state
  const { notes, loading: notesLoading, error: notesError } = useIdeaNotes(ideaId)
  const [newNote, setNewNote] = useState("")
  const [submittingNote, setSubmittingNote] = useState(false)

  useEffect(() => {
    if (idea) {
      // Sync edit state
      setEditTitle(idea.title)
      setEditSummary(idea.summary)
      setEditStatus(idea.status)
      setEditTags(idea.tags.join(", "))
    }
  }, [idea])

  const handleSave = async () => {
    if (!idea || !ideaId) return
    
    setSaving(true)
    
    try {
      const tagArray = editTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "")

      await updateIdea(ideaId, {
        title: editTitle,
        summary: editSummary,
        status: editStatus,
        tags: tagArray,
      })
      
      setIsEditing(false)
      toast.success("Idea updated successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update idea.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!ideaId || !newNote.trim()) return

    // Fallback if not logged in (though typically we require auth)
    const authorId = userId || "anonymous"

    setSubmittingNote(true)
    try {
      await addIdeaNote(ideaId, {
        body: newNote,
        authorId: authorId
      })
      setNewNote("")
      toast.success("Note added!")
    } catch (err) {
      console.error("Error creating note:", err)
      toast.error("Failed to add note.")
    } finally {
      setSubmittingNote(false)
    }
  }

  const handleArchive = async () => {
    if (!ideaId) return
    
    if (!window.confirm("Are you sure you want to archive this idea? It will be removed from the active list.")) {
      return
    }

    try {
      await archiveIdea(ideaId)
      toast.message("Idea archived")
      navigate("/") // Go back to dashboard/list
    } catch (err) {
      console.error(err)
      toast.error("Failed to archive idea.")
    }
  }

  if (ideaLoading) {
    return <IdeaDetailSkeleton />
  }

  if (ideaError || !idea) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pt-12">
        <ErrorState
            title={!idea && !ideaError ? "Idea Not Found" : "Connection Error"}
            message={ideaError || "We couldn't find the idea you're looking for. It might have been deleted or archived."}
            onRetry={() => {
                window.location.reload()
            }}
        />
        <div className="flex justify-center">
            <Button variant="ghost" onClick={() => navigate("/ideas")} className="font-bold">
                ← Back to All Ideas
            </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <BadgePill
              label={idea.status.toUpperCase()}
              variant={
                idea.status === "shipped" ? "success" :
                idea.status === "active" ? "primary" :
                idea.status === "paused" ? "warning" :
                "outline"
              }
            />
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
              ID: {idea.id}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{idea.title}</h1>
          <p className="text-muted-foreground font-medium text-lg">{idea.summary}</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant={isEditing ? "destructive" : "outline"} 
            onClick={() => setIsEditing(!isEditing)}
            className="border-2 border-border shadow-hard-sm font-bold"
          >
            {isEditing ? "Cancel Edit" : "Edit Idea"}
          </Button>
          {!isEditing && (
            <Button 
              variant="destructive" 
              onClick={handleArchive}
              className="border-2 border-border shadow-hard-sm font-bold bg-destructive text-destructive-foreground"
            >
              Archive idea
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {isEditing ? (
            <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-border pb-2">Edit Mode</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-wider">Title</Label>
                  <Input 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)} 
                    className="border-2 border-border shadow-hard-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-wider">Summary</Label>
                  <Textarea 
                    value={editSummary} 
                    onChange={e => setEditSummary(e.target.value)} 
                    className="min-h-[150px] border-2 border-border shadow-hard-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-wider">Status</Label>
                    <Select value={editStatus} onValueChange={(val: ProductIdeaStatus) => setEditStatus(val)}>
                      <SelectTrigger className="border-2 border-border shadow-hard-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-wider">Tags</Label>
                    <Input 
                      value={editTags} 
                      onChange={e => setEditTags(e.target.value)} 
                      placeholder="comma, separated"
                      className="border-2 border-border shadow-hard-sm"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full h-12 text-lg font-black border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all mt-4"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Description</h3>
                  <div className="bg-muted/30 border-2 border-border rounded-2xl p-6 text-lg font-medium leading-relaxed">
                    {idea.summary}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest pl-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map(tag => (
                      <BadgePill key={tag} label={tag} variant="secondary" />
                    ))}
                    {idea.tags.length === 0 && <span className="text-muted-foreground italic text-sm">No tags added yet.</span>}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-card border-2 border-border shadow-hard rounded-3xl p-8 space-y-6">
                <h3 className="text-xl font-black uppercase tracking-tight border-b-2 border-border pb-2">Notes & Feedback</h3>
                
                {/* Notes List */}
                <div className="space-y-4 pt-4">
                  {notesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : notesError ? (
                     <InlineAlert tone="danger" title="Error" message={notesError} />
                  ) : notes.length === 0 ? (
                    <EmptyState
                      icon={<MessageSquarePlus className="h-8 w-8" />}
                      title="No notes yet"
                      description="Share your thoughts, feedback, or technical notes about this idea to keep the momentum going."
                    />
                  ) : (
                    <div className="space-y-3">
                      {notes.map(note => (
                        <div key={note.id} className="bg-muted/30 p-4 rounded-xl border-2 border-border/50 text-sm group relative">
                          <p className="font-medium leading-relaxed">{note.body}</p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">
                              {note.createdAt?.toDate ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(note.createdAt.toDate()) : "Just now"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Note Form */}
                <div className="space-y-4 pt-4 border-t-2 border-border">
                  <Textarea
                    placeholder="Add a new note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    disabled={submittingNote}
                    className="min-h-[100px] border-2 border-border shadow-hard-sm focus-visible:ring-primary"
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
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card border-2 border-border shadow-hard-sm rounded-3xl p-6 space-y-4">
            <h3 className="font-black uppercase tracking-tight border-b-2 border-border pb-2">Idea Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground">Owner</span>
                <span className="font-bold text-sm">{idea.ownerId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground">Created</span>
                <span className="font-bold text-sm">
                  {idea.createdAt?.toDate().toLocaleDateString() || "Just now"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground">Last Updated</span>
                <span className="font-bold text-sm">
                  {idea.updatedAt?.toDate().toLocaleDateString() || "Just now"}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full border-2 border-transparent hover:border-border font-bold"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
