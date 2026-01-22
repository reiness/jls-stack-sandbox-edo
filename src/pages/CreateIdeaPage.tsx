import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, X } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InlineAlert } from "@/components/common/InlineAlert"
import { createIdea, createProductIdeaNote } from "@/lib/firestore/productIdeas"
import { useUser } from "@/lib/context/UserContext"
import type { ProductIdeaStatus } from "@/types/productIdeas"

export default function CreateIdeaPage() {
  const navigate = useNavigate()
  const { userId } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [status, setStatus] = useState<ProductIdeaStatus>("draft")
  const [tags, setTags] = useState("")
  const [pendingNotes, setPendingNotes] = useState<string[]>([])
  const [currentNoteInput, setCurrentNoteInput] = useState("")

  const handleAddPendingNote = () => {
    if (!currentNoteInput.trim()) return
    setPendingNotes([...pendingNotes, currentNoteInput.trim()])
    setCurrentNoteInput("")
  }

  const handleRemovePendingNote = (index: number) => {
    setPendingNotes(pendingNotes.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
      setError("You must be logged in to create an idea.")
      return
    }

    if (!title.trim() || !summary.trim()) {
      setError("Title and summary are required.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "")

      const docRef = await createIdea({
        title,
        summary,
        status,
        tags: tagArray,
        ownerId: userId,
      })

      // Create initial notes if provided
      const finalNotes = [...pendingNotes]
      if (currentNoteInput.trim()) {
        finalNotes.push(currentNoteInput.trim())
      }

      if (finalNotes.length > 0) {
        // Create all notes in parallel
        await Promise.all(finalNotes.map(noteBody =>
          createProductIdeaNote(docRef.id, {
            body: noteBody,
            authorId: userId,
          })
        ))
      }

      // Show success message (using alert for simplicity in this sandbox)
      alert("Idea created successfully!")
      
      // Navigate to the new idea detail page
      navigate(`/ideas/${docRef.id}`)
    } catch (err) {
      console.error(err)
      setError("Failed to create idea. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Create New Idea"
        subtitle="Share your vision for the next great product."
      />

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border-2 border-border shadow-hard rounded-3xl p-8">
        {error && <InlineAlert tone="danger" title="Error" message={error} />}

        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-black uppercase tracking-wider">Title</Label>
          <Input
            id="title"
            placeholder="e.g. AI-Powered Coffee Roaster"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="h-12 border-2 border-border shadow-hard-sm focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-black uppercase tracking-wider">Summary</Label>
          <Textarea
            id="summary"
            placeholder="What problem does this solve?"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            disabled={loading}
            className="min-h-[120px] border-2 border-border shadow-hard-sm focus-visible:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-black uppercase tracking-wider">Initial Status</Label>
            <Select 
              value={status} 
              onValueChange={(val: ProductIdeaStatus) => setStatus(val)}
              disabled={loading}
            >
              <SelectTrigger id="status" className="h-12 border-2 border-border shadow-hard-sm">
                <SelectValue placeholder="Select Status" />
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
            <Label htmlFor="tags" className="text-sm font-black uppercase tracking-wider">Tags</Label>
            <Input
              id="tags"
              placeholder="e.g. ai, coffee, hardware"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={loading}
              className="h-12 border-2 border-border shadow-hard-sm focus-visible:ring-primary"
            />
            <p className="text-[10px] text-muted-foreground font-bold uppercase pl-1">Separate with commas</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <Label className="text-sm font-black uppercase tracking-wider italic text-muted-foreground">Initial Notes (Optional)</Label>
          
          <div className="space-y-3">
            {pendingNotes.map((note, index) => (
              <div key={index} className="flex items-start justify-between bg-muted/30 p-3 rounded-lg border border-border/50 text-sm">
                <p className="pr-4">{note}</p>
                <button
                  type="button"
                  onClick={() => handleRemovePendingNote(index)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={currentNoteInput}
                onChange={(e) => setCurrentNoteInput(e.target.value)}
                disabled={loading}
                className="min-h-[60px] border-2 border-border shadow-hard-sm focus-visible:ring-primary bg-muted/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddPendingNote()
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddPendingNote}
                disabled={!currentNoteInput.trim() || loading}
                className="h-auto border-2 border-border shadow-hard-sm"
              >
                <Plus size={20} />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">Press Enter to add note</p>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Button 
            type="submit" 
            disabled={loading} 
            className="flex-1 h-12 text-lg font-black border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all"
          >
            {loading ? "Creating..." : "Create Idea"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            className="h-12 px-8 border-2 border-border shadow-hard-sm hover:bg-muted font-bold"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
