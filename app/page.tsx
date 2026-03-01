import Link from 'next/link'
import { getProducts } from '@/actions/product'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/HeroSlider'

export default async function HomePage() {
  const products = await getProducts()
  const featuredProducts = products.filter((p) => p.favori)

  return (
    <div>
      <HeroSlider />

      {/* Öne Çıkan Ürünler */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">Koleksiyon</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1 shrink-0"
            >
              Tümünü gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
        </section>
      )}

      {/* İstatistikler */}
      <section className="bg-stone-900 text-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 divide-x divide-stone-700 text-center">
            <div className="px-4 py-2">
              <p className="text-2xl md:text-4xl font-bold text-amber-400">25+</p>
              <p className="text-xs md:text-sm text-stone-300 mt-1">Yıllık Deneyim</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-2xl md:text-4xl font-bold text-amber-400">500+</p>
              <p className="text-xs md:text-sm text-stone-300 mt-1">Mutlu Müşteri</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-2xl md:text-4xl font-bold text-amber-400">3</p>
              <p className="text-xs md:text-sm text-stone-300 mt-1">Ürün Grubu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hakkımızda */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <div className="bg-stone-50 rounded-2xl p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Hakkımızda</p>
          <ul className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              1999 yılından bu yana mermerit, granit ve çimstone ürünlerimizle müşterilerimize kaliteli ve güvenilir hizmet sunmaktayız.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              Müşteri memnuniyetini her zaman ön planda tutarak, sektördeki yenilikleri yakından takip ediyor ve en güncel ürünleri sizlerle buluşturuyoruz.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              Kalite, güven ve estetik anlayışımızla yaşam alanlarınıza değer katmaya devam ediyoruz.
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
