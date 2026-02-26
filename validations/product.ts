import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Ürün adı gereklidir'),
  categoryId: z.string().min(1, 'Kategori seçimi gereklidir'),
})

export type ProductInput = z.infer<typeof productSchema>
