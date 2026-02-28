'use client'

import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/actions/product'
import { getCategories } from '@/actions/category'
import { uploadImage } from '@/actions/upload'
import Button from '@/components/Button'

type Product = {
  id: string
  name: string
  imageUrl: string
  favori: boolean
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
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [zoomedImage, setZoomedImage] = useState<{ url: string; name: string } | null>(null)

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Preview oluştur
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const categoryId = formData.get('categoryId') as string
    const favori = formData.get('favori') === 'on'

    try {
      let imageUrl = editingProduct?.imageUrl || ''

      // Yeni dosya seçildiyse yükle
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

      // Düzenleme mi yoksa yeni ekleme mi?
      const result = editingProduct
        ? await updateProduct(editingProduct.id, name, categoryId, selectedFile ? imageUrl : undefined, favori)
        : await createProduct(name, categoryId, imageUrl, favori)

      if (result.error) {
        setError(result.error)
      } else {
        setShowModal(false)
        setEditingProduct(null)
        setSelectedFile(null)
        setPreviewUrl('')
        await loadData()
      }
    } catch (err) {
      console.error('handleSubmit hatası:', err)
      setError('İşlem sırasında bir hata oluştu')
    } finally {
      setLoading(false)
      setUploading(false)
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

  function openModal(product?: Product) {
    if (product) {
      setEditingProduct(product)
      setPreviewUrl(product.imageUrl)
    }
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingProduct(null)
    setSelectedFile(null)
    setPreviewUrl('')
    setError('')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
        <Button onClick={() => openModal()}>
          Yeni Ürün Ekle
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Resim</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ürün Adı</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Favori</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setZoomedImage({ url: product.imageUrl, name: product.name })}
                  />
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">{product.name}</td>
                <td className="px-6 py-4 text-gray-700">{product.category.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.favori ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.favori ? 'Evet' : 'Hayır'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(product)}
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
          <p className="text-center py-8 text-gray-600">Henüz ürün bulunmamaktadır</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Ürün Adı</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Kategori</label>
                  <select
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">
                    Ürün Resmi {editingProduct && '(Değiştirmek için yeni resim seçin)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingProduct}
                    className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-sm text-gray-600 mt-1">Maksimum dosya boyutu: 5MB</p>
                </div>

                {previewUrl && (
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">Önizleme</label>
                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="favori"
                    id="favori"
                    defaultChecked={editingProduct?.favori ?? false}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="favori" className="text-gray-800 font-semibold">
                    Öne Çıkan Ürün (Favori)
                  </label>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Button type="submit" disabled={loading || uploading}>
                  {uploading ? 'Yükleniyor...' : loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  disabled={loading || uploading}
                >
                  İptal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resim Büyütme Popup */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[80vh]">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
            <img
              src={zoomedImage.url}
              alt={zoomedImage.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-3 font-medium">{zoomedImage.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}
