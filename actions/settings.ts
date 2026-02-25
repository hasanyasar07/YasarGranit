'use server'

import { prisma } from '@/lib/prisma'
import { siteSettingsSchema } from '@/validations/settings'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function updateSiteSettings(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  const data = {
    whatsappNumber: formData.get('whatsappNumber') as string,
    instagramUrl: formData.get('instagramUrl') as string,
    facebookUrl: formData.get('facebookUrl') as string,
    twitterUrl: formData.get('twitterUrl') as string,
  }

  const result = siteSettingsSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  try {
    // Get first settings record or create if doesn't exist
    const existingSettings = await prisma.siteSettings.findFirst()

    if (existingSettings) {
      await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          whatsappNumber: result.data.whatsappNumber,
          instagramUrl: result.data.instagramUrl || null,
          facebookUrl: result.data.facebookUrl || null,
          twitterUrl: result.data.twitterUrl || null,
        },
      })
    } else {
      await prisma.siteSettings.create({
        data: {
          whatsappNumber: result.data.whatsappNumber,
          instagramUrl: result.data.instagramUrl || null,
          facebookUrl: result.data.facebookUrl || null,
          twitterUrl: result.data.twitterUrl || null,
        },
      })
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    return { error: 'Ayarlar güncellenirken bir hata oluştu' }
  }
}

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    return settings
  } catch (error) {
    return null
  }
}
