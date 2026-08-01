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

  const siteUrl = 'https://yasargranit.com'
  const productUrl = `${siteUrl}/products/${product.id}`

  // Fiyat listesi yok, teklif usulü çalışılıyor. Bu yüzden uydurma price
  // vermek yerine offers'ı InStock + iletişim URL'i olarak bırakıyoruz;
  // yanlış fiyat vermek Google'da da AI cevaplarında da zarar verir.
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}/#product`,
    name: product.name,
    image: product.imageUrl ? [product.imageUrl] : [],
    description: `${product.name}, Yaşar Granit'in ${product.category.name} kategorisindeki doğal taş ürünü. Manavgat ve Antalya bölgesinde tezgah, döşeme ve kaplama uygulamaları için üretim ve montaj yapılır.`,
    category: product.category.name,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'Yaşar Granit',
    },
    material: product.category.name,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'TRY',
      url: productUrl,
      seller: { '@id': `${siteUrl}/#business` },
      areaServed: [
        { '@type': 'City', name: 'Manavgat' },
        { '@type': 'City', name: 'Antalya' },
      ],
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Ürünler', item: `${siteUrl}/products` },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category.name,
        item: `${siteUrl}/products?category=${product.categoryId}`,
      },
      { '@type': 'ListItem', position: 4, name: product.name, item: productUrl },
    ],
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 pb-24 md:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
