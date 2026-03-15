/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { getOrnekUrunler, createOrnekUrun, deleteOrnekUrun } from '@/actions/ornekUrun'
import { getCategories } from '@/actions/category'
import { getProducts } from '@/actions/product'
import { uploadImage } from '@/actions/upload'
import ConfirmModal from '@/components/ConfirmModal'

type OrnekUrun = {
  id: string
  imageUrl: string
  product: { id: string; name: string; category: { name: string } }
}
type Category = { id: string; name: string }
type Product = { id: string; name: string; categoryId: string }

function Spinner({ small }: { small?: boolean }) {
  return (
    <svg className={`animate-spin ${small ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

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
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [ornekler, cats, prods] = await Promise.all([getOrnekUrunler(), getCategories(), getProducts()])
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Örnek Ürünler</h1>
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

      {/* Filters */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Ürün adı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {(searchQuery || filterCategory) && (
            <button
              onClick={() => { setSearchQuery(''); setFilterCategory('') }}
              className="px-3 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl bg-white"
            >
              Temizle
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 pl-1">{filteredItems.length} kayıt</p>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400 text-sm">
          {searchQuery || filterCategory ? 'Sonuç bulunamadı' : 'Henüz örnek ürün eklenmemiş'}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.product.name}
                  className="w-full h-32 object-cover cursor-pointer active:opacity-80"
                  onClick={() => setZoomedImage(item.imageUrl)}
                />
                <button
                  onClick={() => setConfirmId(item.id)}
                  disabled={deletingId === item.id}
                  className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center disabled:opacity-50 active:bg-red-600"
                >
                  {deletingId === item.id ? <Spinner small /> : (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="px-2.5 py-2">
                <p className="text-xs font-semibold text-gray-900 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-400 truncate">{item.product.category.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm */}
      {confirmId && (
        <ConfirmModal
          message={`"${items.find((i) => i.id === confirmId)?.product.name}" ürününe ait bu örnek resmi silmek istediğinizden emin misiniz?`}
          onConfirm={() => { const id = confirmId; setConfirmId(null); handleDelete(id) }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Image Zoom */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt=""
            className="w-full max-w-sm rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Bottom Sheet Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-8 max-h-[92vh] overflow-y-auto safe-area-bottom">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-5">Yeni Örnek Ürün Ekle</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Kategori */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Ürün dropdown */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ürün</label>
                  <button
                    type="button"
                    disabled={!selectedCategoryId}
                    onClick={() => setProductDropdownOpen((v) => !v)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-left text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 flex justify-between items-center"
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
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          placeholder="Ürün ara..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          autoFocus
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <ul className="max-h-48 overflow-y-auto">
                        {filteredProducts
                          .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                          .map((p) => (
                            <li
                              key={p.id}
                              onClick={() => { setSelectedProductId(p.id); setProductDropdownOpen(false); setProductSearch('') }}
                              className={`px-4 py-3 text-sm cursor-pointer active:bg-blue-50 ${selectedProductId === p.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-800'}`}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Örnek Resim</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">Maks. 5MB</p>
                </div>
                {previewUrl && (
                  <img src={previewUrl} alt="Önizleme" className="w-full h-44 object-cover rounded-xl" />
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
