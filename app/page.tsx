import Link from 'next/link'
import { getProducts } from '@/actions/product'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/HeroSlider'

export default async function HomePage() {
  const products = await getProducts()
  const featuredProducts = products.filter((p) => p.favori)

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

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
            <p className="text-lg text-gray-700">
              1999 yılından bu güne kadar yüzlerce müşterimize mermerit, granit ve çimston ürünlerimizle hizmet vermekteyiz. Müşteri memnuniyeti birinci önceliğimiz olduğundan müşteri sayımız her geçen gün katlanarak artmaktadır. Müşterilerimize daha iyi hizmet sunabilmek için sektördeki gelişmeleri yakından takip ediyor, en yeni ürünleri müşterilerimizle buluşturmaktan gurur duyuyoruz. Müşteri memnuniyeti, bizim için önemlidir ve onların memnuniyeti bizim memnuniyetimizdir...
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
