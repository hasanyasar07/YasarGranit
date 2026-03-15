import { getProducts } from '@/actions/product'
import { getCategories } from '@/actions/category'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardPage() {
  const products = await getProducts()
  const categories = await getCategories()
  const favoriCount = products.filter((p) => p.favori).length

  const stats = [
    { label: 'Toplam Ürün', value: products.length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Kategori', value: categories.length, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Öne Çıkan', value: favoriCount, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  const quickLinks = [
    {
      href: '/admin/dashboard/products',
      label: 'Ürün Ekle',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-blue-600',
    },
    {
      href: '/admin/dashboard/categories',
      label: 'Kategori Ekle',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-green-600',
    },
    {
      href: '/admin/dashboard/ornek-urunler',
      label: 'Örnek Ekle',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      color: 'bg-purple-600',
    },
    {
      href: '/admin/dashboard/settings',
      label: 'Ayarlar',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-gray-700',
    },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-5">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.color} text-white rounded-xl p-4 flex items-center gap-3 active:opacity-80`}
            >
              {link.icon}
              <span className="font-semibold text-sm">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Son Eklenen Ürünler</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {products.slice(0, 5).map((product, idx) => (
            <div
              key={product.id}
              className={`flex items-center gap-3 p-3 ${idx < Math.min(products.length, 5) - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category.name}</p>
              </div>
              {product.favori && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  Öne Çıkan
                </span>
              )}
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">Henüz ürün eklenmemiş</p>
          )}
        </div>
      </div>
    </div>
  )
}
