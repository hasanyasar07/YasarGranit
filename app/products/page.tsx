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
      <div className="mb-6 md:mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">Katalog</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ürünlerimiz</h1>
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
