import Link from 'next/link'
import { getProducts } from '@/actions/product'
import ProductCard from '@/components/ProductCard'

export default async function HomePage() {
  const products = await getProducts()
  const featuredProducts = products.slice(0, 6)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Yaşar Granit</h1>
          <p className="text-xl mb-8">Doğal Taş ve Granit Ürünleri ile Mekanlarınıza Değer Katın</p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ürünleri Keşfedin
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Öne Çıkan Ürünler</h2>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
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
          <p className="text-center text-gray-500">Henüz ürün bulunmamaktadır.</p>
        )}

        {featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Tüm Ürünleri Görüntüle
            </Link>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Hakkımızda</h2>
            <p className="text-lg text-gray-700 mb-4">
              Yaşar Granit olarak, doğal taş ve granit ürünleri konusunda uzman kadromuz ile
              sizlere en kaliteli hizmeti sunmaktayız.
            </p>
            <p className="text-lg text-gray-700">
              Mutfak tezgahlarından banyo uygulamalarına, zemin kaplamalarından duvar
              kaplamasına kadar geniş ürün yelpazemizle mekanlarınıza değer katıyoruz.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
