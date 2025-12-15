import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <Card className="bg-card border-2 border-border shadow-hard rounded-3xl">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
        {description ? (
          <p className="text-xs text-muted-foreground font-bold opacity-80">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
