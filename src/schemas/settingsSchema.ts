import { z } from "zod"

export const settingsSchema = z.object({
  displayName: z.string().min(2).max(40),
  role: z.string().min(1, "Select a role"),
  bio: z.string().max(160).optional(),
  notifications: z.boolean().default(true),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
