import type { ReactNode } from "react"
import { PackageOpen } from "lucide-react"

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/50 bg-muted/30 p-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-hard-sm">
        <PackageOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-lg font-bold text-foreground">{title}</div>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground font-bold">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
