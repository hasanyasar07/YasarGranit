'use client'

import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/actions/category'
import Button from '@/components/Button'

type Category = {
  id: string
  name: string
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
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
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategorideki tüm ürünler de silinecektir!')) return

    const result = await deleteCategory(id)
    if (result.error) {
      alert(result.error)
    } else {
      await loadCategories()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
        <Button onClick={() => setShowModal(true)}>
          Yeni Kategori Ekle
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4">{category.name}</td>
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
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-center py-8 text-gray-500">Henüz kategori bulunmamaktadır</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Kategori Adı</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
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
