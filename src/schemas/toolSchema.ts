import { z } from "zod"

export const toolSchema = z.object({
  name: z.string()
    .min(3, "Tool name must be at least 3 characters")
    .max(50, "Tool name cannot exceed 50 characters"),
  
  category: z.string()
    .min(1, "Please select a valid category"),

  visibility: z.enum(["public", "internal"]),

  description: z.string()
    .min(10, "Description must be at least 10 characters long")
    .max(200, "Description is too long (max 200 characters)"),

  tags: z.string().optional(),
})

export type ToolFormValues = z.infer<typeof toolSchema>
