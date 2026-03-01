'use client'

import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, toggleFavori } from '@/actions/product'
import { getCategories } from '@/actions/category'
import { uploadImage } from '@/actions/upload'
import Button from '@/components/Button'
import ConfirmModal from '@/components/ConfirmModal'

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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

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
    setDeletingId(id)
    const result = await deleteProduct(id)
    setDeletingId(null)
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

  const filteredProducts = products.filter((p) => {
    const matchCategory = filterCategory ? p.categoryId === filterCategory : true
    const matchSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    return matchCategory && matchSearch
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
        <Button onClick={() => openModal()}>
          Yeni Ürün Ekle
        </Button>
      </div>

      {/* Arama ve filtre */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Ürün adı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-56"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {(searchQuery || filterCategory) && (
          <button
            onClick={() => { setSearchQuery(''); setFilterCategory('') }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Temizle
          </button>
        )}
        <span className="self-center text-sm text-gray-500">{filteredProducts.length} ürün</span>
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
            {filteredProducts.map((product) => (
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
                  <button
                    onClick={async () => {
                      setTogglingId(product.id)
                      await toggleFavori(product.id, !product.favori)
                      await loadData()
                      setTogglingId(null)
                    }}
                    disabled={togglingId === product.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 ${product.favori ? 'bg-green-500' : 'bg-gray-300'}`}
                    aria-label="Favori toggle"
                  >
                    {togglingId === product.id ? (
                      <svg className="animate-spin h-3.5 w-3.5 mx-auto text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${product.favori ? 'translate-x-6' : 'translate-x-1'}`} />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openModal(product)}
                    className="text-blue-600 hover:text-blue-700 mr-4"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => setConfirmId(product.id)}
                    disabled={deletingId === product.id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {deletingId === product.id ? (
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
        {filteredProducts.length === 0 && (
          <p className="text-center py-8 text-gray-600">
            {searchQuery || filterCategory ? 'Arama kriterlerine uygun ürün bulunamadı' : 'Henüz ürün bulunmamaktadır'}
          </p>
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

      {/* Silme Onay Modalı */}
      {confirmId && (
        <ConfirmModal
          message={`"${products.find((p) => p.id === confirmId)?.name}" ürününü silmek istediğinizden emin misiniz?`}
          onConfirm={() => { const id = confirmId; setConfirmId(null); handleDelete(id) }}
          onCancel={() => setConfirmId(null)}
        />
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
