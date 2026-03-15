import { getOrnekUrunler } from '@/actions/ornekUrun'
import { getCategories } from '@/actions/category'
import Link from 'next/link'
import OrnekUrunlerGrid from '@/components/OrnekUrunlerGrid'

export const metadata = {
  title: 'Örnek Ürünler - Yaşar Granit',
  description: 'Gerçekleştirdiğimiz çalışmalar ve örnek ürünlerimiz.',
}

export default async function OrnekUrunlerPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; category?: string }>
}) {
  const params = await searchParams
  const productId = params.product
  const categoryId = params.category

  const [items, categories] = await Promise.all([
    getOrnekUrunler(productId, categoryId),
    getCategories(),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">Referanslar</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Örnek Ürünler</h1>
      </div>

      {/* Kategori filtresi */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/ornek-urunler"
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
            !categoryId && !productId
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-gray-600 border-gray-200 hover:border-stone-400'
          }`}
        >
          Tümü
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/ornek-urunler?category=${category.id}`}
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

      {items.length > 0 ? (
        <OrnekUrunlerGrid items={items} />
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-base">Bu kategoride örnek ürün bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}
