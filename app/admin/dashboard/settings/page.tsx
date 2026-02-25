'use client'

import { useEffect, useState } from 'react'
import { getSiteSettings, updateSiteSettings } from '@/actions/settings'
import Button from '@/components/Button'

type Settings = {
  whatsappNumber: string
  instagramUrl?: string | null
  facebookUrl?: string | null
  twitterUrl?: string | null
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const data = await getSiteSettings()
    setSettings(data)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await updateSiteSettings(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        await loadSettings()
      }
    } catch {
      setError('İşlem sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Site Ayarları</h1>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                WhatsApp Numarası *
              </label>
              <input
                type="text"
                name="whatsappNumber"
                defaultValue={settings?.whatsappNumber || ''}
                placeholder="905xxxxxxxxx"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-sm text-gray-500 mt-1">
                Örnek: 905551234567 (Ülke kodu ile birlikte, başında + olmadan)
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                defaultValue={settings?.instagramUrl || ''}
                placeholder="https://instagram.com/username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                defaultValue={settings?.facebookUrl || ''}
                placeholder="https://facebook.com/username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                name="twitterUrl"
                defaultValue={settings?.twitterUrl || ''}
                placeholder="https://twitter.com/username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
              Ayarlar başarıyla güncellendi!
            </div>
          )}

          <div className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
