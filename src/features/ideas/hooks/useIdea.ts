import { useState, useEffect } from "react"
import { subscribeToIdeaById } from "@/lib/firestore/productIdeas"
import type { ProductIdea } from "@/types/productIdeas"
import { useRealTime } from "@/lib/context/RealTimeContext"

export function useIdea(ideaId: string | undefined) {
  const [idea, setIdea] = useState<ProductIdea | null>(null)
  const [loading, setLoading] = useState(!!ideaId)
  const [error, setError] = useState<string | null>(null)
  const { setStatus } = useRealTime()

  // Sync state if ideaId changes during render to avoid stale data
  const [prevId, setPrevId] = useState(ideaId)
  if (ideaId !== prevId) {
    setPrevId(ideaId)
    setIdea(null)
    setLoading(!!ideaId)
    setError(null)
  }

  useEffect(() => {
    if (!ideaId) {
      setStatus("off")
      return
    }

    setStatus("active")
    const unsubscribe = subscribeToIdeaById(
      ideaId,
      (nextIdea) => {
        setIdea(nextIdea)
        setLoading(false)
        setStatus("active")
      },
      (err) => {
        console.error("Error subscribing to idea:", err)
        setError("Failed to load idea in real time :(")
        setLoading(false)
        setStatus("error")
      }
    )

    return () => {
      unsubscribe()
      setStatus("off")
    }
  }, [ideaId, setStatus])

  return {
    idea,
    loading,
    error,
  }
}
