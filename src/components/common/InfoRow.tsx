import type { ReactNode } from "react"

type InfoRowProps = {
  label: string
  value: string | ReactNode
  action?: ReactNode
}

export function InfoRow({ label, value, action }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-border/10 py-4 last:border-0">
      <div className="space-y-0.5">
        <div className="text-sm font-bold text-muted-foreground">{label}</div>
        <div className="font-medium text-foreground">{value}</div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
