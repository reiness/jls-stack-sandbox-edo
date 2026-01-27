import { useState, useEffect, useCallback } from "react"
import { fetchIdeasPage, type IdeaListFilters } from "@/lib/firestore/productIdeas"
import type { ProductIdea } from "@/types/productIdeas"
import { type QueryDocumentSnapshot, type DocumentData } from "firebase/firestore"
import { useRealTime } from "@/lib/context/RealTimeContext"

export function useIdeasList(filters: IdeaListFilters, pageSize = 3) {
  const [items, setItems] = useState<ProductIdea[]>([])
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setStatus } = useRealTime()

  const loadInitial = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetchIdeasPage({ filters, pageSize, cursor: null })
      setItems(res.items)
      setCursor(res.nextCursor)
      setStatus("active")
    } catch (e) {
      console.error(e)
      setError("Failed to load ideas.")
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }, [filters, pageSize, setStatus])

  const loadMore = useCallback(async () => {
    if (!cursor || isLoadingMore) return
    setIsLoadingMore(true)
    try {
      const res = await fetchIdeasPage({ filters, pageSize, cursor })
      setItems(prev => [...prev, ...res.items])
      setCursor(res.nextCursor)
    } catch (e) {
      console.error(e)
      setError("Failed to load more ideas.")
    } finally {
      setIsLoadingMore(false)
    }
  }, [cursor, filters, pageSize, isLoadingMore])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  return {
    items,
    isLoading,
    isLoadingMore,
    error,
    hasMore: !!cursor,
    loadMore,
    refresh: loadInitial
  }
}
