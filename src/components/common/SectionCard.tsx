import type { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <Card className="bg-card border-2 border-border shadow-hard rounded-3xl">
      <CardHeader>
        <h2 className="text-xl font-semibold text-foreground leading-none tracking-tight">{title}</h2>
        {description ? (
          <p className="text-xs text-muted-foreground font-bold">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
