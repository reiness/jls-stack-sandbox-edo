import { Timestamp } from "firebase/firestore"

export type ProductIdeaStatus = "draft" | "active" | "paused" | "shipped"

export const STATUS_OPTIONS: { label: string; value: ProductIdeaStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Shipped", value: "shipped" },
]

export type ProductIdeaPriority = "low" | "medium" | "high"

export interface ProductIdea {
  id: string
  title: string
  titleLower?: string
  summary: string
  status: ProductIdeaStatus
  priority?: ProductIdeaPriority
  tags: string[]
  ownerId: string
  assigneeId?: string
  targetDate?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  archivedAt?: Timestamp | null
}

export interface ProductIdeaNote {
  id: string
  body: string
  authorId: string
  createdAt: Timestamp
}