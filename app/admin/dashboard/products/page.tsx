'use client'

import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/actions/product'
import { getCategories } from '@/actions/category'
import Button from '@/components/Button'

type Product = {
  id: string
  name: string
  description: string
  price: { toString: () => string }
  imageUrl: string
  stock: number | null
  categoryId: string
  category: { name: string }
}

type Category = {
  id: string
  name: string
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories(),
    ])
    setProducts(productsData)
    setCategories(categoriesData)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = editingProduct
        ? await updateProduct(editingProduct.id, formData)
        : await createProduct(formData)

      if (result.error) {
        setError(result.error)
      } else {
        setShowModal(false)
        setEditingProduct(null)
        await loadData()
      }
    } catch {
      setError('İşlem sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    const result = await deleteProduct(id)
    if (result.error) {
      alert(result.error)
    } else {
      await loadData()
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ürün Yönetimi</h1>
        <Button onClick={() => setShowModal(true)}>
          Yeni Ürün Ekle
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category.name}</td>
                <td className="px-6 py-4">{product.price.toString()} ₺</td>
                <td className="px-6 py-4">{product.stock ?? '-'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setEditingProduct(product)
                      setShowModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-700 mr-4"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-8 text-gray-500">Henüz ürün bulunmamaktadır</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Açıklama</label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct?.description}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Fiyat (₺)</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    defaultValue={editingProduct?.price.toString()}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Resim URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={editingProduct?.imageUrl}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Stok (İsteğe Bağlı)</label>
                  <input
                    type="number"
                    name="stock"
                    defaultValue={editingProduct?.stock ?? ''}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Kategori</label>
                  <select
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
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
