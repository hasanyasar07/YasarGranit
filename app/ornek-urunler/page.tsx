import { getOrnekUrunler } from '@/actions/ornekUrun'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Örnek Ürünler - Yaşar Granit',
  description: 'Gerçekleştirdiğimiz çalışmalar ve örnek ürünlerimiz.',
}

export default async function OrnekUrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>
}) {
  const params = await searchParams
  const productId = params.product
  const items = await getOrnekUrunler(productId)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">Referanslar</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Örnek Ürünler</h1>
        </div>
        {productId && (
          <Link
            href="/ornek-urunler"
            className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            Tümünü gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-stone-300 hover:shadow-lg transition-all duration-300">
              <div className="relative h-40 sm:h-52 md:h-60 bg-gray-50 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 md:p-4 border-t border-gray-100">
                <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                  {item.product.category.name}
                </p>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight mb-2">
                  {item.product.name}
                </h3>
                <Link
                  href={`/products/${item.product.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Ürüne Git
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-base">Henüz örnek ürün bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}
