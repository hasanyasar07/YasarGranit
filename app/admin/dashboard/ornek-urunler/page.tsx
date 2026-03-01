'use client'

import { useEffect, useState } from 'react'
import { getOrnekUrunler, createOrnekUrun, deleteOrnekUrun } from '@/actions/ornekUrun'
import { getCategories } from '@/actions/category'
import { getProducts } from '@/actions/product'
import { uploadImage } from '@/actions/upload'
import Button from '@/components/Button'
import ConfirmModal from '@/components/ConfirmModal'

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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)

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
    setProductSearch('')
    setProductDropdownOpen(false)
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
    setDeletingId(id)
    const result = await deleteOrnekUrun(id)
    setDeletingId(null)
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
    setProductSearch('')
    setProductDropdownOpen(false)
    setError('')
  }

  const filteredItems = items.filter((item) => {
    const matchCategory = filterCategory ? item.product.category.name === categories.find(c => c.id === filterCategory)?.name : true
    const matchSearch = searchQuery ? item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    return matchCategory && matchSearch
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Örnek Ürün Yönetimi</h1>
        <Button onClick={() => setShowModal(true)}>Yeni Örnek Ürün Ekle</Button>
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
        <span className="self-center text-sm text-gray-500">{filteredItems.length} kayıt</span>
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
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <img src={item.imageUrl} alt="" className="w-20 h-14 object-cover rounded" />
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">{item.product.name}</td>
                <td className="px-6 py-4 text-gray-700">{item.product.category.name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setConfirmId(item.id)}
                    disabled={deletingId === item.id}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {deletingId === item.id ? (
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
        {filteredItems.length === 0 && (
          <p className="text-center py-8 text-gray-600">
            {searchQuery || filterCategory ? 'Arama kriterlerine uygun kayıt bulunamadı' : 'Henüz örnek ürün bulunmamaktadır'}
          </p>
        )}
      </div>

      {/* Silme Onay Modalı */}
      {confirmId && (
        <ConfirmModal
          message={`"${items.find((i) => i.id === confirmId)?.product.name}" ürününe ait bu örnek resmi silmek istediğinizden emin misiniz?`}
          onConfirm={() => { const id = confirmId; setConfirmId(null); handleDelete(id) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

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
                <div className="relative">
                  <label className="block text-gray-800 font-semibold mb-2">Ürün</label>
                  <button
                    type="button"
                    disabled={!selectedCategoryId}
                    onClick={() => setProductDropdownOpen((v) => !v)}
                    className="w-full px-4 py-2 border rounded-lg text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:text-gray-400 flex justify-between items-center"
                  >
                    <span className={selectedProductId ? 'text-gray-900' : 'text-gray-400'}>
                      {selectedProductId
                        ? filteredProducts.find((p) => p.id === selectedProductId)?.name
                        : selectedCategoryId ? 'Ürün Seçin' : 'Önce kategori seçin'}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {productDropdownOpen && selectedCategoryId && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          placeholder="Ürün ara..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          autoFocus
                          className="w-full px-3 py-1.5 text-sm border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <ul className="max-h-48 overflow-y-auto">
                        {filteredProducts
                          .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                          .map((p) => (
                            <li
                              key={p.id}
                              onClick={() => {
                                setSelectedProductId(p.id)
                                setProductDropdownOpen(false)
                                setProductSearch('')
                              }}
                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${selectedProductId === p.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-800'}`}
                            >
                              {p.name}
                            </li>
                          ))}
                        {filteredProducts.filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                          <li className="px-4 py-3 text-sm text-gray-400 text-center">Ürün bulunamadı</li>
                        )}
                      </ul>
                    </div>
                  )}
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
