import { BadgePill } from "./BadgePill"
import type { ProductIdeaPriority } from "@/types/productIdeas"

interface PriorityBadgeProps {
  priority?: ProductIdeaPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (!priority || !['low', 'medium', 'high'].includes(priority)) return null

  const config = {
    low: { label: "Low Priority", variant: "info" as const },
    medium: { label: "Medium", variant: "warning" as const },
    high: { label: "High Priority", variant: "destructive" as const },
  }

  const { label, variant } = config[priority]

  return <BadgePill label={label} variant={variant} />
}
