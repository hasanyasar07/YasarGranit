'use server'

import { prisma } from '@/lib/prisma'
import { productSchema } from '@/validations/product'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function createProduct(name: string, categoryId: string, imageUrl: string) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  const result = productSchema.safeParse({ name, categoryId })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  if (!imageUrl) {
    return { error: 'Resim yüklenmedi' }
  }

  try {
    await prisma.product.create({
      data: {
        name: result.data.name,
        imageUrl,
        categoryId: result.data.categoryId,
      },
    })

    revalidatePath('/products')
    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (error) {
    return { error: 'Ürün oluşturulurken bir hata oluştu' }
  }
}

export async function updateProduct(id: string, name: string, categoryId: string, imageUrl?: string) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  const result = productSchema.safeParse({ name, categoryId })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    const updateData: any = {
      name: result.data.name,
      categoryId: result.data.categoryId,
    }

    // Eğer yeni resim yüklendiyse güncelle
    if (imageUrl) {
      updateData.imageUrl = imageUrl
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/products')
    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (error) {
    return { error: 'Ürün güncellenirken bir hata oluştu' }
  }
}

export async function deleteProduct(id: string) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  try {
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/products')
    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (error) {
    return { error: 'Ürün silinirken bir hata oluştu' }
  }
}

export async function getProducts(categoryId?: string) {
  try {
    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return products
  } catch (error) {
    return []
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })
    return product
  } catch (error) {
    return null
  }
}
