/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { getSlides, createSlide, updateSlide, deleteSlide } from '@/actions/slide'
import { uploadImage } from '@/actions/upload'
import ConfirmModal from '@/components/ConfirmModal'

type Slide = {
  id: string
  imageUrl: string
  text: string
  order: number
}

function Spinner({ small }: { small?: boolean }) {
  return (
    <svg className={`animate-spin ${small ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
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
        if (uploadResult.error) { setError(uploadResult.error); setLoading(false); return }
        imageUrl = uploadResult.url!
      }
      const result = editingSlide
        ? await updateSlide(editingSlide.id, text, order, selectedFile ? imageUrl : undefined)
        : await createSlide(imageUrl, text, order)
      if (result.error) { setError(result.error) }
      else { closeModal(); await loadData() }
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
    if (slide) { setEditingSlide(slide); setPreviewUrl(slide.imageUrl) }
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
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">Slide Yönetimi</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm active:bg-blue-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ekle
        </button>
      </div>

      {/* List */}
      {slides.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400 text-sm">
          Henüz slide bulunmamaktadır
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex items-stretch">
              <img
                src={slide.imageUrl}
                alt={slide.text}
                className="w-24 object-cover flex-shrink-0"
              />
              <div className="flex-1 px-3 py-3 min-w-0">
                <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{slide.text}</p>
                <p className="text-xs text-gray-400 mt-1">Sıra: {slide.order}</p>
              </div>
              <div className="flex flex-col gap-1.5 p-2 flex-shrink-0 justify-center">
                <button
                  onClick={() => openModal(slide)}
                  className="p-2 text-blue-600 bg-blue-50 rounded-lg active:bg-blue-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setConfirmId(slide.id)}
                  disabled={deletingId === slide.id}
                  className="p-2 text-red-500 bg-red-50 rounded-lg active:bg-red-100 disabled:opacity-40"
                >
                  {deletingId === slide.id ? <Spinner small /> : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm */}
      {confirmId && (
        <ConfirmModal
          message={`"${slides.find((s) => s.id === confirmId)?.text}" slide'ını silmek istediğinizden emin misiniz?`}
          onConfirm={() => { const id = confirmId; setConfirmId(null); handleDelete(id) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Bottom Sheet Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-8 max-h-[92vh] overflow-y-auto safe-area-bottom">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editingSlide ? 'Slide Düzenle' : 'Yeni Slide Ekle'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slide Yazısı</label>
                  <input
                    type="text"
                    name="text"
                    defaultValue={editingSlide?.text}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Slide üzerine yazılacak metin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sıra No</label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingSlide?.order ?? slides.length}
                    min={0}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Slide Resmi {editingSlide && <span className="font-normal text-gray-400">(değiştirmek için seçin)</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingSlide}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">Maks. 5MB</p>
                </div>
                {previewUrl && (
                  <img src={previewUrl} alt="Önizleme" className="w-full h-40 object-cover rounded-xl" />
                )}
              </div>
              {error && <p className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</p>}
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-base disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {(loading || uploading) && <Spinner />}
                  {uploading ? 'Yükleniyor...' : loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading || uploading}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-base"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
