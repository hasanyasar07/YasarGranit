'use server'

import { prisma } from '@/lib/prisma'
import { productSchema } from '@/validations/product'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function createProduct(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: formData.get('price') as string,
    imageUrl: formData.get('imageUrl') as string,
    stock: formData.get('stock') as string,
    categoryId: formData.get('categoryId') as string,
  }

  const result = productSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await prisma.product.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        price: result.data.price,
        imageUrl: result.data.imageUrl,
        stock: result.data.stock ? parseInt(result.data.stock) : null,
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

export async function updateProduct(id: string, formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: formData.get('price') as string,
    imageUrl: formData.get('imageUrl') as string,
    stock: formData.get('stock') as string,
    categoryId: formData.get('categoryId') as string,
  }

  const result = productSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: result.data.name,
        description: result.data.description,
        price: result.data.price,
        imageUrl: result.data.imageUrl,
        stock: result.data.stock ? parseInt(result.data.stock) : null,
        categoryId: result.data.categoryId,
      },
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
