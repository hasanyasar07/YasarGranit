import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Ürün adı gereklidir'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Geçerli bir fiyat giriniz',
  }),
  imageUrl: z.string().url('Geçerli bir URL giriniz'),
  stock: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori seçimi gereklidir'),
})

export type ProductInput = z.infer<typeof productSchema>
