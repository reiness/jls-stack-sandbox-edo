import type { ReactNode } from "react"
import { SectionCard } from "../common/SectionCard"

type Stat = {
  label: string
  value: ReactNode
  hint?: string
}

const defaultStats: Stat[] = [
  { label: "Routes", value: "3+" },
  { label: "Shell", value: "Online" },
  { label: "UI System", value: "Growing" },
]

export function StatsRow({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <SectionCard
      title="Sandbox Status"
      description="High-level snapshot of what your app supports."
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="rounded-lg border-2 border-border bg-muted p-4 shadow-hard-sm"
          >
            <div className="text-xs text-muted-foreground font-bold">{s.label}</div>
            <div className="text-lg font-semibold text-foreground">{s.value}</div>
            {s.hint ? (
              <div className="text-xs text-muted-foreground mt-1">{s.hint}</div>
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
