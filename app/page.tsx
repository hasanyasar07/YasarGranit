import type { Metadata } from 'next'
import Link from 'next/link'
import { getProducts } from '@/actions/product'
import { getSlides } from '@/actions/slide'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/HeroSlider'

export const metadata: Metadata = {
  title: "Yaşar Granit | Manavgat Mermer, Mermerit ve Granit Ürünleri",
  description:
    "Manavgat ve Antalya bölgesinde 1999'dan bu yana granit, mermerit coante ve  çimstone ürünleri sunuyoruz. Her türlü tezgah için hemen iletişime geçin.",
  alternates: {
    canonical: "https://yasargranit.com",
  },
}

// Tek kaynak: hem görünür SSS bölümü hem FAQPage şeması bunu kullanır.
// Şemadaki cevap sayfada görünmüyorsa Google bunu ihlal sayar, o yüzden
// ikisini ayrı ayrı yazmıyoruz.
const faq = [
  {
    q: 'Hangi bölgelere hizmet veriyorsunuz?',
    a: 'Manavgat merkez olmak üzere Antalya ili ve çevre ilçelere granit, mermer, mermerit ve çimstone üretim ile montaj hizmeti veriyoruz.',
  },
  {
    q: 'Fiyatlarınızı nasıl öğrenebilirim?',
    a: 'Fiyatlar ölçü, malzeme ve uygulama detayına göre değiştiği için sabit liste yayınlamıyoruz. 0533 731 18 46 numarasından telefon veya WhatsApp ile ulaşarak ücretsiz keşif ve fiyat teklifi alabilirsiniz.',
  },
  {
    q: 'Mutfak tezgahı için hangi malzemeyi seçmeliyim?',
    a: 'Granit yüksek ısı ve çizilme direnci ile yoğun kullanılan mutfaklar için uygundur. Çimstone homojen görünüm ve leke tutmayan yüzey sunar. Mermer estetik açıdan öne çıkar ancak asitli sıvılara karşı daha hassastır. Kullanım alışkanlığınıza göre ekibimiz uygun olanı önerir.',
  },
  {
    q: 'Ölçü ve montaj hizmeti veriyor musunuz?',
    a: 'Evet. Yerinde ölçü alımı, kesim, işleme ve montaj sürecinin tamamını kendi ekibimizle yapıyoruz.',
  },
  {
    q: 'Ne zamandan beri faaliyet gösteriyorsunuz?',
    a: '1999 yılından bu yana Manavgat ve Antalya bölgesinde doğal taş sektöründe faaliyet gösteriyoruz.',
  },
]

export default async function HomePage() {
  const [products, slides] = await Promise.all([getProducts(), getSlides()])
  const featuredProducts = products.filter((p) => p.favori)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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

      {/* Sıkça Sorulan Sorular */}
      <section className="max-w-6xl mx-auto px-4 pb-10 md:pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
          Sıkça Sorulan Sorular
        </p>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Merak Edilenler
        </h2>
        <div className="space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none">
                <h3 className="text-sm md:text-base font-semibold text-gray-900">
                  {item.q}
                </h3>
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-sm md:text-base text-gray-700 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
