'use server'

import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/validations/category'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function createCategory(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  const data = {
    name: formData.get('name') as string,
  }

  const result = categorySchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await prisma.category.create({
      data: {
        name: result.data.name,
      },
    })

    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (error) {
    return { error: 'Kategori oluşturulurken bir hata oluştu' }
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  const data = {
    name: formData.get('name') as string,
  }

  const result = categorySchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: result.data.name,
      },
    })

    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (error) {
    return { error: 'Kategori güncellenirken bir hata oluştu' }
  }
}

export async function deleteCategory(id: string) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  try {
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (error) {
    return { error: 'Kategori silinirken bir hata oluştu' }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return categories
  } catch (error) {
    return []
  }
}
