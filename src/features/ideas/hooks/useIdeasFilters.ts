import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import type { IdeaListFilters, IdeaListStatus } from "@/lib/firestore/productIdeas"

const DEFAULTS: Required<IdeaListFilters> = {
  q: "",
  status: "all",
  tag: "all",
  archived: false,
}

function readBool(value: string | null, fallback: boolean) {
  if (value === null) return fallback
  return value === "true"
}

export function useIdeasFilters() {
  const [params, setParams] = useSearchParams()

  const state: Required<IdeaListFilters> = useMemo(() => {
    return {
      q: params.get("q") ?? DEFAULTS.q,
      status: (params.get("status") ?? DEFAULTS.status) as IdeaListStatus,
      tag: params.get("tag") ?? DEFAULTS.tag,
      archived: readBool(params.get("archived"), DEFAULTS.archived),
    }
  }, [params])

  function setFilters(patch: Partial<IdeaListFilters>) {
    const next = { ...state, ...patch }

    const nextParams = new URLSearchParams()

    if (next.q) nextParams.set("q", next.q)
    if (next.status !== "all") nextParams.set("status", next.status)
    if (next.tag !== "all" && next.tag !== "") nextParams.set("tag", next.tag)
    if (next.archived !== false) nextParams.set("archived", String(next.archived))

    setParams(nextParams, { replace: true })
  }

  function resetFilters() {
    setParams(new URLSearchParams(), { replace: true })
  }

  return { filters: state, setFilters, resetFilters }
}
