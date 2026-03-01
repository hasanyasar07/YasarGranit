'use client'

import { useEffect, useState } from 'react'
import { getOrnekUrunler, createOrnekUrun, deleteOrnekUrun } from '@/actions/ornekUrun'
import { getCategories } from '@/actions/category'
import { getProducts } from '@/actions/product'
import { uploadImage } from '@/actions/upload'
import Button from '@/components/Button'

type OrnekUrun = {
  id: string
  imageUrl: string
  product: { id: string; name: string; category: { name: string } }
}

type Category = { id: string; name: string }
type Product = { id: string; name: string; categoryId: string }

export default function OrnekUrunlerAdminPage() {
  const [items, setItems] = useState<OrnekUrun[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const [showModal, setShowModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [ornekler, cats, prods] = await Promise.all([
      getOrnekUrunler(),
      getCategories(),
      getProducts(),
    ])
    setItems(ornekler)
    setCategories(cats)
    setProducts(prods)
  }

  function handleCategoryChange(categoryId: string) {
    setSelectedCategoryId(categoryId)
    setSelectedProductId('')
    setFilteredProducts(products.filter((p) => p.categoryId === categoryId))
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

    if (!selectedProductId) { setError('Ürün seçiniz'); return }
    if (!selectedFile) { setError('Resim seçiniz'); return }

    setLoading(true)
    try {
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      const uploadResult = await uploadImage(uploadFormData)
      setUploading(false)

      if (uploadResult.error) { setError(uploadResult.error); return }

      const result = await createOrnekUrun(selectedProductId, uploadResult.url!)
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
    if (!confirm('Bu örnek ürünü silmek istediğinizden emin misiniz?')) return
    const result = await deleteOrnekUrun(id)
    if (result.error) alert(result.error)
    else await loadData()
  }

  function closeModal() {
    setShowModal(false)
    setSelectedCategoryId('')
    setSelectedProductId('')
    setSelectedFile(null)
    setPreviewUrl('')
    setFilteredProducts([])
    setError('')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Örnek Ürün Yönetimi</h1>
        <Button onClick={() => setShowModal(true)}>Yeni Örnek Ürün Ekle</Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Resim</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ürün</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <img src={item.imageUrl} alt="" className="w-20 h-14 object-cover rounded" />
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">{item.product.name}</td>
                <td className="px-6 py-4 text-gray-700">{item.product.category.name}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700">
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="text-center py-8 text-gray-600">Henüz örnek ürün bulunmamaktadır</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Yeni Örnek Ürün Ekle</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Kategori seç */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Kategori</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Ürün seç */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Ürün</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                    disabled={!selectedCategoryId}
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {selectedCategoryId ? 'Ürün Seçin' : 'Önce kategori seçin'}
                    </option>
                    {filteredProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Resim */}
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Örnek Resim</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
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
                  {uploading ? 'Yükleniyor...' : loading ? 'Kaydediliyor...' : 'Kaydet'}
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
