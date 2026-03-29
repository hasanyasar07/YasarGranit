import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts } from '@/actions/product'
import { getSlides } from '@/actions/slide'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/HeroSlider'

export const metadata: Metadata = {
  title: "Yaşar Granit | Manavgat Mermer, Mermerit ve Granit Ürünleri",
  description:
    "Manavgat ve Antalya bölgesinde 1999'dan bu yana granit, mermer, mermerit ve çimstone ürünleri sunuyoruz. Granit tezgah, mermer döşeme, taş kaplama için hemen iletişime geçin.",
  alternates: {
    canonical: "https://yasargranit.com",
  },
}

export default async function HomePage() {
  const [products, slides] = await Promise.all([getProducts(), getSlides()])
  const featuredProducts = products.filter((p) => p.favori)

  return (
    <div>
      <HeroSlider slides={slides} />

      {/* Öne Çıkan Ürünler */}
      {featuredProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <div>
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


      {/* Hakkımızda */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <div className="bg-stone-50 rounded-2xl p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Hakkımızda</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Manavgat&apos;ın Güvenilir Granit, Mermer ve Mermerit Firması
          </h2>
          <ul className="space-y-3 text-gray-700 text-sm md:text-base leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              1999 yılından bu yana Manavgat ve Antalya bölgesinde mermerit, granit ve çimstone ürünlerimizle müşterilerimize kaliteli ve güvenilir hizmet sunmaktayız.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              Granit tezgah, mermer döşeme, mermerit kaplama ve çimstone uygulamalarında Antalya&apos;nın en deneyimli ekibiyle yanınızdayız.
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
