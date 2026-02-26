'use server'

import { put } from '@vercel/blob'
import { getSession } from '@/lib/auth'

export async function uploadImage(formData: FormData) {
  const session = await getSession()
  if (!session) {
    return { error: 'Yetkisiz erişim' }
  }

  const file = formData.get('file') as File

  if (!file) {
    return { error: 'Dosya seçilmedi' }
  }

  // Dosya tipi kontrolü
  if (!file.type.startsWith('image/')) {
    return { error: 'Sadece resim dosyaları yüklenebilir' }
  }

  // Dosya boyutu kontrolü (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' }
  }

  try {
    // Benzersiz dosya adı oluştur
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`

    const blob = await put(fileName, file, {
      access: 'public',
    })

    return { url: blob.url }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: `Dosya yüklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` }
  }
}
