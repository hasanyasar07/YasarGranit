'use client'

import { useEffect, useState } from 'react'
import { getSlides, createSlide, updateSlide, deleteSlide } from '@/actions/slide'
import { uploadImage } from '@/actions/upload'
import Button from '@/components/Button'
import ConfirmModal from '@/components/ConfirmModal'

type Slide = {
  id: string
  imageUrl: string
  text: string
  order: number
}

export default function SlidesManagementPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setSlides(await getSlides())
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const text = formData.get('text') as string
    const order = parseInt(formData.get('order') as string) || 0

    try {
      let imageUrl = editingSlide?.imageUrl || ''

      if (selectedFile) {
        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)
        const uploadResult = await uploadImage(uploadFormData)
        setUploading(false)

        if (uploadResult.error) {
          setError(uploadResult.error)
          setLoading(false)
          return
        }
        imageUrl = uploadResult.url!
      }

      const result = editingSlide
        ? await updateSlide(editingSlide.id, text, order, selectedFile ? imageUrl : undefined)
        : await createSlide(imageUrl, text, order)

      if (result.error) {
        setError(result.error)
      } else {
        closeModal()
        await loadData()
      }
    } catch {
      setError('İşlem sırasında bir hata oluştu')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    const result = await deleteSlide(id)
    setDeletingId(null)
    if (result.error) alert(result.error)
    else await loadData()
  }

  function openModal(slide?: Slide) {
    if (slide) {
      setEditingSlide(slide)
      setPreviewUrl(slide.imageUrl)
    }
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingSlide(null)
    setSelectedFile(null)
    setPreviewUrl('')
    setError('')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Slide Yönetimi</h1>
        <Button onClick={() => openModal()}>Yeni Slide Ekle</Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Resim</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Yazı</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Sıra</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {slides.map((slide) => (
              <tr key={slide.id}>
                <td className="px-6 py-4">
                  <img
                    src={slide.imageUrl}
                    alt={slide.text}
                    className="w-24 h-14 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">{slide.text}</td>
                <td className="px-6 py-4 text-gray-700">{slide.order}</td>
                <td className="px-6 py-4">
                  <button onClick={() => openModal(slide)} className="text-blue-600 hover:text-blue-700 mr-4">
                    Düzenle
                  </button>
                  <button
                    onClick={() => setConfirmId(slide.id)}
                    disabled={deletingId === slide.id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {deletingId === slide.id ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Siliniyor...
                      </>
                    ) : 'Sil'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {slides.length === 0 && (
          <p className="text-center py-8 text-gray-600">Henüz slide bulunmamaktadır</p>
        )}
      </div>

      {/* Silme Onay Modalı */}
      {confirmId && (
        <ConfirmModal
          message={`"${slides.find((s) => s.id === confirmId)?.text}" slide'ını silmek istediğinizden emin misiniz?`}
          onConfirm={() => { const id = confirmId; setConfirmId(null); handleDelete(id) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingSlide ? 'Slide Düzenle' : 'Yeni Slide Ekle'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Slide Yazısı</label>
                  <input
                    type="text"
                    name="text"
                    defaultValue={editingSlide?.text}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Slide üzerine yazılacak metin"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Sıra No</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingSlide?.order ?? slides.length}
                    min={0}
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Slide Resmi {editingSlide && '(Değiştirmek için yeni resim seçin)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingSlide}
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maksimum dosya boyutu: 5MB</p>
                </div>

                {previewUrl && (
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">Önizleme</label>
                    <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
              )}

              <div className="flex gap-4 mt-6">
                <Button type="submit" disabled={loading || uploading}>
                  <span className="inline-flex items-center gap-2">
                    {(loading || uploading) && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    )}
                    {uploading ? 'Yükleniyor...' : loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </span>
                </Button>
                <Button type="button" variant="secondary" onClick={closeModal} disabled={loading || uploading}>
                  İptal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
