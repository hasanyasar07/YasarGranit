'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import type { OrnekUrun, Product, Category } from '@prisma/client'

type OrnekUrunWithProduct = OrnekUrun & {
  product: Product & { category: Category }
}

export async function getOrnekUrunler(productId?: string, categoryId?: string): Promise<OrnekUrunWithProduct[]> {
  try {
    return await prisma.ornekUrun.findMany({
      where: {
        ...(productId ? { productId } : {}),
        ...(categoryId ? { product: { categoryId } } : {}),
      },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function createOrnekUrun(productId: string, imageUrl: string) {
  const session = await getSession()
  if (!session) return { error: 'Yetkisiz erişim' }
  if (!productId) return { error: 'Ürün seçilmedi' }
  if (!imageUrl) return { error: 'Resim yüklenmedi' }

  try {
    await prisma.ornekUrun.create({ data: { productId, imageUrl } })
    revalidatePath('/ornek-urunler')
    revalidatePath(`/products/${productId}`)
    return { success: true }
  } catch {
    return { error: 'Örnek ürün oluşturulurken bir hata oluştu' }
  }
}

export async function deleteOrnekUrun(id: string) {
  const session = await getSession()
  if (!session) return { error: 'Yetkisiz erişim' }

  try {
    const item = await prisma.ornekUrun.findUnique({ where: { id } })
    await prisma.ornekUrun.delete({ where: { id } })
    revalidatePath('/ornek-urunler')
    if (item) revalidatePath(`/products/${item.productId}`)
    return { success: true }
  } catch {
    return { error: 'Örnek ürün silinirken bir hata oluştu' }
  }
}
