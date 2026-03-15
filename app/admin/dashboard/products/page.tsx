/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, toggleFavori } from '@/actions/product'
import { getCategories } from '@/actions/category'
import { uploadImage } from '@/actions/upload'
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

function Spinner({ small }: { small?: boolean }) {
  return (
    <svg className={`animate-spin ${small ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
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

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()])
    setProducts(productsData)
    setCategories(categoriesData)
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
    const name = formData.get('name') as string
    const categoryId = formData.get('categoryId') as string
    const favori = formData.get('favori') === 'on'
    try {
      let imageUrl = editingProduct?.imageUrl || ''
      if (selectedFile) {
        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)
        const uploadResult = await uploadImage(uploadFormData)
        setUploading(false)
        if (uploadResult.error) { setError(uploadResult.error); setLoading(false); return }
        imageUrl = uploadResult.url!
      }
      const result = editingProduct
        ? await updateProduct(editingProduct.id, name, categoryId, selectedFile ? imageUrl : undefined, favori)
        : await createProduct(name, categoryId, imageUrl, favori)
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
    const result = await deleteProduct(id)
    setDeletingId(null)
    if (result.error) alert(result.error)
    else await loadData()
  }

  function openModal(product?: Product) {
    if (product) { setEditingProduct(product); setPreviewUrl(product.imageUrl) }
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Ürünler</h1>
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

      {/* Search & Filter */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Ürün ara..."
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
              className="px-3 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl bg-white active:bg-gray-50"
            >
              Temizle
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 pl-1">{filteredProducts.length} ürün</p>
      </div>

      {/* Product Cards */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-400 text-sm">
            {searchQuery || filterCategory ? 'Sonuç bulunamadı' : 'Henüz ürün eklenmemiş'}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 cursor-pointer active:opacity-80"
                  onClick={() => setZoomedImage({ url: product.imageUrl, name: product.name })}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.category.name}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      onClick={async () => {
                        setTogglingId(product.id)
                        await toggleFavori(product.id, !product.favori)
                        await loadData()
                        setTogglingId(null)
                      }}
                      disabled={togglingId === product.id}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-60 ${product.favori ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      {togglingId === product.id ? (
                        <span className="mx-auto"><Spinner small /></span>
                      ) : (
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${product.favori ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      )}
                    </button>
                    <span className="text-xs text-gray-500">{product.favori ? 'Öne çıkan' : 'Normal'}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => openModal(product)}
                    className="p-2 text-blue-600 bg-blue-50 rounded-lg active:bg-blue-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setConfirmId(product.id)}
                    disabled={deletingId === product.id}
                    className="p-2 text-red-500 bg-red-50 rounded-lg active:bg-red-100 disabled:opacity-40"
                  >
                    {deletingId === product.id ? <Spinner small /> : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Delete */}
      {confirmId && (
        <ConfirmModal
          message={`"${products.find((p) => p.id === confirmId)?.name}" ürününü silmek istediğinizden emin misiniz?`}
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
          <div className="relative w-full max-w-sm">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl font-bold"
            >
              &times;
            </button>
            <img
              src={zoomedImage.url}
              alt={zoomedImage.name}
              className="w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-3 text-sm font-medium">{zoomedImage.name}</p>
          </div>
        </div>
      )}

      {/* Bottom Sheet Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-8 max-h-[92vh] overflow-y-auto safe-area-bottom">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ürün Adı</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ürün adını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                  <select
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ürün Resmi {editingProduct && <span className="font-normal text-gray-400">(değiştirmek için seçin)</span>}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingProduct}
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 active:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Maks. 5MB</p>
                </div>
                {previewUrl && (
                  <img src={previewUrl} alt="Önizleme" className="w-full h-44 object-cover rounded-xl" />
                )}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="favori"
                    id="favori"
                    defaultChecked={editingProduct?.favori ?? false}
                    className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Öne Çıkan Ürün</span>
                </label>
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
