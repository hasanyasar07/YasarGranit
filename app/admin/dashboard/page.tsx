import { getProducts } from '@/actions/product'
import { getCategories } from '@/actions/category'
import Link from 'next/link'

export default async function DashboardPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Toplam Ürün</h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Toplam Kategori</h3>
          <p className="text-3xl font-bold text-green-600">{categories.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Stokta Ürün</h3>
          <p className="text-3xl font-bold text-purple-600">
            {products.filter((p) => p.stock && p.stock > 0).length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Hızlı İşlemler</h2>
          <div className="space-y-3">
            <Link
              href="/admin/dashboard/products"
              className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Ürün Yönetimi
            </Link>
            <Link
              href="/admin/dashboard/categories"
              className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Kategori Yönetimi
            </Link>
            <Link
              href="/admin/dashboard/settings"
              className="block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Site Ayarları
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Son Eklenen Ürünler</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category.name}</p>
                </div>
                <p className="font-bold text-blue-600">{product.price.toString()} ₺</p>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center">Henüz ürün eklenmemiş</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
