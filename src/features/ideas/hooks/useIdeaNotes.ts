import { useEffect, useState } from "react"
import { subscribeToIdeaNotes, type IdeaNote } from "@/lib/firestore/ideaNotes"

export function useIdeaNotes(ideaId: string | undefined) {
  const [notes, setNotes] = useState<IdeaNote[]>([])
  const [loading, setLoading] = useState(!!ideaId)
  const [error, setError] = useState<string | null>(null)

  // Sync state if ideaId changes during render to avoid stale data
  const [prevId, setPrevId] = useState(ideaId)
  if (ideaId !== prevId) {
    setPrevId(ideaId)
    setNotes([])
    setLoading(!!ideaId)
    setError(null)
  }

  useEffect(() => {
    if (!ideaId) {
      return
    }

    const unsubscribe = subscribeToIdeaNotes(
      ideaId,
      (updatedNotes) => {
        setNotes(updatedNotes)
        setLoading(false)
      },
      (err) => {
        console.error("Error subscribing to notes:", err)
        setError("Failed to load notes.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [ideaId])

  return { notes, loading, error }
}
