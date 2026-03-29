import { getProduct } from '@/actions/product'
import { getSiteSettings } from '@/actions/settings'
import { getOrnekUrunler } from '@/actions/ornekUrun'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductDetail from '@/components/ProductDetail'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) return { title: 'Ürün Bulunamadı - Yaşar Granit' }

  return {
    title: `${product.name} - ${product.category.name} | Yaşar Granit Manavgat`,
    description: `Manavgat Yaşar Granit'ten ${product.name} (${product.category.name}). Antalya ve Manavgat bölgesine teslim. Fiyat almak için WhatsApp ile ulaşın.`,
    keywords: [
      product.name,
      product.category.name,
      `${product.name} manavgat`,
      `${product.name} antalya`,
      `${product.category.name} fiyat`,
    ],
    alternates: {
      canonical: `https://yasargranit.com/products/${product.id}`,
    },
    openGraph: {
      title: `${product.name} - ${product.category.name} | Yaşar Granit`,
      description: `Manavgat Yaşar Granit'ten ${product.name}. Fiyat almak için iletişime geçin.`,
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, settings, ornekUrunler] = await Promise.all([
    getProduct(id),
    getSiteSettings(),
    getOrnekUrunler(id),
  ])

  if (!product) notFound()

  const whatsappMessage = encodeURIComponent(
    `Merhaba, ${product.name} ürünü için bilgi almak istiyorum.`
  )
  const whatsappLink = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`
    : '#'

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 pb-24 md:pb-10">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Ürünlere Dön
      </Link>

      <ProductDetail
        product={product}
        whatsappLink={whatsappLink}
        showWhatsapp={!!settings?.whatsappNumber}
        ornekUrunler={ornekUrunler}
      />
    </div>
  )
}
