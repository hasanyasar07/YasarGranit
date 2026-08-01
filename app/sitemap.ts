import { MetadataRoute } from 'next'
import { getProducts } from '@/actions/product'

const siteUrl = 'https://yasargranit.com'

// Ürün listesi DB'den geliyor; build'de donmasın diye saatlik tazelenir
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified: product.createdAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // getProducts createdAt'e göre azalan sıralı döner → ilk kayıt en yenisi.
  // Sabit sayfalara "şimdi" yerine bunu veriyoruz; yoksa her tazelemede
  // hiç değişmemiş sayfalar "yeni güncellendi" görünür.
  const lastContentUpdate = products[0]?.createdAt ?? new Date()

  return [
    {
      url: siteUrl,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ornek-urunler`,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/iletisim`,
      lastModified: new Date('2026-07-21'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...productUrls,
  ]
}
