import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gereklidir'),
})

export type CategoryInput = z.infer<typeof categorySchema>
