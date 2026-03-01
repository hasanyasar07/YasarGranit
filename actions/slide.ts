'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function getSlides() {
  try {
    return await prisma.slide.findMany({ orderBy: { order: 'asc' } })
  } catch {
    return []
  }
}

export async function createSlide(imageUrl: string, text: string, order: number) {
  const session = await getSession()
  if (!session) return { error: 'Yetkisiz erişim' }

  if (!imageUrl) return { error: 'Resim yüklenmedi' }
  if (!text.trim()) return { error: 'Yazı alanı boş olamaz' }

  try {
    await prisma.slide.create({ data: { imageUrl, text, order } })
    revalidatePath('/')
    return { success: true }
  } catch {
    return { error: 'Slide oluşturulurken bir hata oluştu' }
  }
}

export async function updateSlide(id: string, text: string, order: number, imageUrl?: string) {
  const session = await getSession()
  if (!session) return { error: 'Yetkisiz erişim' }

  try {
    const data: { text: string; order: number; imageUrl?: string } = { text, order }
    if (imageUrl) data.imageUrl = imageUrl

    await prisma.slide.update({ where: { id }, data })
    revalidatePath('/')
    return { success: true }
  } catch {
    return { error: 'Slide güncellenirken bir hata oluştu' }
  }
}

export async function deleteSlide(id: string) {
  const session = await getSession()
  if (!session) return { error: 'Yetkisiz erişim' }

  try {
    await prisma.slide.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch {
    return { error: 'Slide silinirken bir hata oluştu' }
  }
}
