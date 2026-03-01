'use client'

import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/actions/category'
import Button from '@/components/Button'
import ConfirmModal from '@/components/ConfirmModal'

type Category = {
  id: string
  name: string
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

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
        setShowModal(false)
        setEditingCategory(null)
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
    if (result.error) {
      alert(result.error)
    } else {
      await loadCategories()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kategori Yönetimi</h1>
        <Button onClick={() => setShowModal(true)}>
          Yeni Kategori Ekle
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori Adı</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 text-gray-900 font-medium">{category.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setEditingCategory(category)
                      setShowModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-700 mr-4"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => setConfirmId(category.id)}
                    disabled={deletingId === category.id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {deletingId === category.id ? (
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
        {categories.length === 0 && (
          <p className="text-center py-8 text-gray-600">Henüz kategori bulunmamaktadır</p>
        )}
      </div>

      {/* Silme Onay Modalı */}
      {confirmId && (
        <ConfirmModal
          message={`"${categories.find((c) => c.id === confirmId)?.name}" kategorisini silmek istediğinizden emin misiniz? Bu kategorideki tüm ürünler de silinecektir.`}
          onConfirm={() => { const id = confirmId; setConfirmId(null); handleDelete(id) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-800 font-semibold mb-2">Kategori Adı</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name}
                  required
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  <span className="inline-flex items-center gap-2">
                    {loading && (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    )}
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false)
                    setEditingCategory(null)
                    setError('')
                  }}
                >
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
