import { useState, useEffect } from "react"
import { updateProductIdea } from "@/lib/firestore/productIdeas"
import { STATUS_OPTIONS, type ProductIdea, type ProductIdeaPriority, type ProductIdeaStatus } from "@/types/productIdeas"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { InlineAlert } from "../common/InlineAlert"

type EditIdeaDialogProps = {
  idea: ProductIdea | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditIdeaDialog({ idea, open, onOpenChange, onSuccess }: EditIdeaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [priority, setPriority] = useState<ProductIdeaPriority>("medium")
  const [status, setStatus] = useState<ProductIdeaStatus>("draft")
  const [tags, setTags] = useState("")

  useEffect(() => {
    if (idea && open) {
      setTitle(idea.title)
      setSummary(idea.summary)
      setPriority(idea.priority ?? "medium")
      setStatus(idea.status)
      setTags(idea.tags.join(", "))
    }
  }, [idea, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!idea) return

    if (!title.trim() || !summary.trim()) {
      setError("Title and summary are required.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean)

      await updateProductIdea(idea.id, {
        title,
        summary,
        priority,
        status,
        tags: parsedTags,
      })

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      setError("Failed to update idea. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Edit Idea</DialogTitle>
          <DialogDescription>
            Update the details of your product idea.
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
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
