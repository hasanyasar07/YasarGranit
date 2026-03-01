import { getProducts } from '@/actions/product'
import { getCategories } from '@/actions/category'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const metadata = {
  title: 'Ürünlerimiz - Yaşar Granit',
  description: 'Geniş ürün yelpazemizi keşfedin. Doğal taş ve granit ürünleri.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const categoryId = params.category
  const products = await getProducts(categoryId)
  const categories = await getCategories()

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">Katalog</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ürünlerimiz</h1>
        </div>
        <Link
          href="/ornek-urunler"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Örnek Ürünler
        </Link>
      </div>

      {/* Kategori filtresi */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
            !categoryId
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-stone-400'
          }`}
        >
          Tümü
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              categoryId === category.id
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-stone-400'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Ürün grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.imageUrl}
              categoryName={product.category.name}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-base">Bu kategoride ürün bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}
