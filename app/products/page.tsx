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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Ürünlerimiz</h1>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-lg transition-colors ${
            !categoryId
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Tümü
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className={`px-4 py-2 rounded-lg transition-colors ${
              categoryId === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price.toString()}
              imageUrl={product.imageUrl}
              categoryName={product.category.name}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Bu kategoride ürün bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}
