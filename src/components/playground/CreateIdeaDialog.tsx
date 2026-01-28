import { useState } from "react"
import { useUser } from "@/lib/context/UserContext"
import { createProductIdea, createProductIdeaNote } from "@/lib/firestore/productIdeas"
import { STATUS_OPTIONS, type ProductIdeaPriority, type ProductIdeaStatus } from "@/types/productIdeas"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { InlineAlert } from "../common/InlineAlert"
import { Plus } from "lucide-react"

type CreateIdeaDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateIdeaDialog({ open, onOpenChange, onSuccess }: CreateIdeaDialogProps) {
  const { userId } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [priority, setPriority] = useState<ProductIdeaPriority>("medium")
  const [status, setStatus] = useState<ProductIdeaStatus>("draft")
  const [tags, setTags] = useState("")
  const [notes, setNotes] = useState<string[]>([])

  const handleAddNote = () => {
    setNotes([...notes, ""])
  }

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...notes]
    newNotes[index] = value
    setNotes(newNotes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !summary.trim()) {
      setError("Title and summary are required.")
      return
    }

    if (!userId) {
      setError("You must be signed in to create an idea.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean)

      const newIdeaId = await createProductIdea({
        title,
        summary,
        priority,
        status,
        ownerId: userId,
        tags: parsedTags.length > 0 ? parsedTags : ["new"],
      })

      // Create all valid notes
      const validNotes = notes.filter(n => n.trim())
      if (validNotes.length > 0) {
        await Promise.all(validNotes.map(noteBody => 
          createProductIdeaNote(newIdeaId, {
            body: noteBody,
            authorId: userId
          })
        ))
      }
      
      // Reset form
      setTitle("")
      setSummary("")
      setPriority("medium")
      setStatus("draft")
      setTags("")
      setNotes([])
      
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      setError("Failed to create idea. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Create New Idea</DialogTitle>
          <DialogDescription>
            Share your brilliant product idea with the team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <InlineAlert tone="danger" title="Error" message={error} />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
              <Select 
                value={status} 
                onValueChange={(val: ProductIdeaStatus) => setStatus(val)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
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
              <label className="text-xs font-bold uppercase text-muted-foreground">Priority</label>
              <Select 
                value={priority} 
                onValueChange={(val: ProductIdeaPriority) => setPriority(val)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
            <Input 
              placeholder="e.g. AI-Powered Coffee Maker" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Summary</label>
            <Textarea 
              placeholder="Describe the problem and your solution..." 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={loading}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Tags</label>
            <Input 
              placeholder="comma, separated, tags" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-muted-foreground">Initial Notes</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddNote}
                disabled={loading}
                className="h-6 px-2 text-xs font-bold hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Note
              </Button>
            </div>
            
            {notes.length === 0 && (
              <p className="text-xs text-muted-foreground italic border-2 border-dashed border-border/30 rounded-md p-3 text-center">
                No initial notes. Click "Add Note" to add one.
              </p>
            )}

            <div className="space-y-3">
              {notes.map((noteContent, index) => (
                <div key={index} className="animate-in slide-in-from-top-2 duration-200">
                  <Textarea 
                    placeholder={`Note #${index + 1}...`}
                    value={noteContent}
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                    disabled={loading}
                    className="min-h-[60px]"
                    autoFocus={index === notes.length - 1} // Auto-focus new notes
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              variant="default"
              className="border-2 border-border shadow-hard hover:translate-y-[2px] hover:shadow-hard-sm active:translate-y-[4px] active:shadow-none transition-all font-black tracking-wide"
            >
              {loading ? "Creating..." : "Create Idea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
