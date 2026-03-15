'use client'

import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/actions/category'
import ConfirmModal from '@/components/ConfirmModal'

type Category = {
  id: string
  name: string
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    const data = await getCategories()
    setCategories(data)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = editingCategory
        ? await updateCategory(editingCategory.id, formData)
        : await createCategory(formData)
      if (result.error) {
        setError(result.error)
      } else {
        closeModal()
        await loadCategories()
      }
    } catch {
      setError('İşlem sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    const result = await deleteCategory(id)
    setDeletingId(null)
    if (result.error) alert(result.error)
    else await loadCategories()
  }

  function closeModal() {
    setShowModal(false)
    setEditingCategory(null)
    setError('')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">Kategoriler</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm active:bg-blue-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ekle
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-center py-12 text-gray-400">Henüz kategori bulunmamaktadır</p>
        ) : (
          categories.map((category, idx) => (
            <div
              key={category.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${idx < categories.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <span className="flex-1 font-medium text-gray-900">{category.name}</span>
              <button
                onClick={() => { setEditingCategory(category); setShowModal(true) }}
                className="p-2 text-blue-600 active:bg-blue-50 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setConfirmId(category.id)}
                disabled={deletingId === category.id}
                className="p-2 text-red-500 active:bg-red-50 rounded-lg disabled:opacity-40"
              >
                {deletingId === category.id ? <Spinner /> : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Confirm Modal */}
      {confirmId && (
        <ConfirmModal
          message={`"${categories.find((c) => c.id === confirmId)?.name}" kategorisini silmek istediğinizden emin misiniz? Bu kategorideki tüm ürünler de silinecektir.`}
          onConfirm={() => { const id = confirmId; setConfirmId(null); handleDelete(id) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Bottom Sheet Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-8 safe-area-bottom">
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori Adı</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name}
                  required
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kategori adını girin"
                />
              </div>
              {error && <p className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-base disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Spinner />}
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
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
