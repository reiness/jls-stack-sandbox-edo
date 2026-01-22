import type { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function SectionCard({ title, description, children, actions }: SectionCardProps) {
  return (
    <Card className="bg-card border-2 border-border shadow-hard rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground leading-none tracking-tight">{title}</h2>
          {description ? (
            <p className="text-xs text-muted-foreground font-bold">{description}</p>
          ) : null}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
