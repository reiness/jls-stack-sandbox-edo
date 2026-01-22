import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit2, Check, X as CloseIcon } from "lucide-react"
import { BadgePill } from "@/components/common/BadgePill"
import { InlineAlert } from "@/components/common/InlineAlert"
import { getIdeaById, updateIdea, archiveIdea, getProductIdeaNotes, createProductIdeaNote, deleteProductIdeaNote, updateProductIdeaNote } from "@/lib/firestore/productIdeas"
import { useUser } from "@/lib/context/UserContext"
import type { ProductIdea, ProductIdeaStatus, ProductIdeaNote } from "@/types/productIdeas"

export default function IdeaDetailPage() {
  const { ideaId } = useParams()
  const navigate = useNavigate()
  const { userId } = useUser()
  
  const [idea, setIdea] = useState<ProductIdea | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editSummary, setEditSummary] = useState("")
  const [editStatus, setEditStatus] = useState<ProductIdeaStatus>("draft")
  const [editTags, setEditTags] = useState("")
  const [saving, setSaving] = useState(false)

  // Notes state
  const [notes, setNotes] = useState<ProductIdeaNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [submittingNote, setSubmittingNote] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editNoteBody, setEditNoteBody] = useState("")

  useEffect(() => {
    if (ideaId) {
      fetchIdea(ideaId)
      fetchNotes(ideaId)
    }
  }, [ideaId])

  const fetchNotes = async (id: string) => {
    try {
      const fetchedNotes = await getProductIdeaNotes(id)
      setNotes(fetchedNotes)
    } catch (err) {
      console.error("Error fetching notes:", err)
    }
  }

  const fetchIdea = async (id: string) => {
    setLoading(true)
    try {
      const data = await getIdeaById(id)
      if (data) {
        setIdea(data)
        // Sync edit state
        setEditTitle(data.title)
        setEditSummary(data.summary)
        setEditStatus(data.status)
        setEditTags(data.tags.join(", "))
      } else {
        setError("Idea not found.")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to load idea details.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!idea || !ideaId) return
    
    setSaving(true)
    setError(null)
    
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
      
      // Refresh local data
      await fetchIdea(ideaId)
      setIsEditing(false)
      alert("Idea updated successfully!")
    } catch (err) {
      console.error(err)
      setError("Failed to update idea.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddNote = async () => {
    if (!ideaId || !newNote.trim() || !userId) return

    setSubmittingNote(true)
    try {
      await createProductIdeaNote(ideaId, {
        body: newNote,
        authorId: userId
      })
      setNewNote("")
      await fetchNotes(ideaId)
    } catch (err) {
      console.error("Error creating note:", err)
      alert("Failed to add note.")
    } finally {
      setSubmittingNote(false)
    }
  }

  const handleUpdateNote = async (noteId: string) => {
    if (!ideaId || !editNoteBody.trim()) return

    try {
      await updateProductIdeaNote(ideaId, noteId, editNoteBody.trim())
      setEditingNoteId(null)
      await fetchNotes(ideaId)
    } catch (err) {
      console.error("Error updating note:", err)
      alert("Failed to update note.")
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!ideaId || !userId) return
    if (!window.confirm("Are you sure you want to delete this note?")) return

    try {
      await deleteProductIdeaNote(ideaId, noteId)
      await fetchNotes(ideaId)
    } catch (err) {
      console.error("Error deleting note:", err)
      alert("Failed to delete note.")
    }
  }

  const handleArchive = async () => {
    if (!ideaId) return
    
    if (!window.confirm("Are you sure you want to archive this idea? It will be removed from the active list.")) {
      return
    }

    try {
      await archiveIdea(ideaId)
      alert("Idea archived.")
      navigate("/") // Go back to dashboard/list
    } catch (err) {
      console.error(err)
      alert("Failed to archive idea.")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-muted-foreground gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-bold animate-pulse">Fetching Idea Details...</p>
      </div>
    )
  }

  if (error || !idea) {
    return (
      <div className="space-y-6">
        <PageHeader title="Idea Not Found" subtitle="The requested idea could not be loaded." />
        <InlineAlert tone="danger" title="Error" message={error || "Idea not found."} />
        <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
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
              variant={idea.status === "shipped" ? "success" : "outline"}
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
              Archive
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
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
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
                
                <div className="space-y-4">
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

                <div className="space-y-4 pt-4">
                  {notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-4">No notes yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {notes.map(note => (
                        <div key={note.id} className="bg-muted/30 p-4 rounded-xl border-2 border-border/50 text-sm group relative">
                          {editingNoteId === note.id ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editNoteBody}
                                onChange={e => setEditNoteBody(e.target.value)}
                                className="min-h-[80px] border-2 border-border shadow-hard-sm focus-visible:ring-primary"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingNoteId(null)}
                                  className="h-8 w-8 p-0"
                                >
                                  <CloseIcon size={16} />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateNote(note.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check size={16} />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="pr-16 font-medium leading-relaxed">{note.body}</p>
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">
                                  {note.createdAt?.toDate().toLocaleDateString() || "Just now"}
                                </p>
                                {note.authorId === userId && (
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => {
                                        setEditingNoteId(note.id)
                                        setEditNoteBody(note.body)
                                      }}
                                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                                      title="Edit note"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNote(note.id)}
                                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                      title="Delete note"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card border-2 border-border shadow-hard-sm rounded-3xl p-6 space-y-4">
            <h3 className="font-black uppercase tracking-tight border-b-2 border-border pb-2">Details</h3>
            
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
