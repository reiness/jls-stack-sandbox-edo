import { Timestamp } from "firebase/firestore"

export type ProductIdeaStatus = "draft" | "active" | "paused" | "shipped"

export type ProductIdeaPriority = "low" | "medium" | "high"

export interface ProductIdea {
  id: string
  title: string
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