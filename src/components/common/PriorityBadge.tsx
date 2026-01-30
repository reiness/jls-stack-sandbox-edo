import { BadgePill } from "./BadgePill"
import type { ProductIdeaPriority } from "@/types/productIdeas"

interface PriorityBadgeProps {
  priority?: ProductIdeaPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (!priority) return null

  const config = {
    low: { label: "Low", variant: "info" as const },
    medium: { label: "Standard", variant: "warning" as const },
    high: { label: "Urgent", variant: "destructive" as const },
  }

  const { label, variant } = config[priority]

  return <BadgePill label={label} variant={variant} />
}
