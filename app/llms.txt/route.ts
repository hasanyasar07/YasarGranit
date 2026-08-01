import { getCategories } from '@/actions/category'
import { getProducts } from '@/actions/product'

const siteUrl = 'https://yasargranit.com'

// llms.txt: AI asistanlarının/arama motorlarının siteyi hızlı ve doğru
// özetlemesi için düz metin kaynak. İçerik DB'den geldiği için saatlik tazelenir.
export const revalidate = 3600

export async function GET() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  const byCategory = categories.map((category) => ({
    name: category.name,
    id: category.id,
    products: products.filter((p) => p.categoryId === category.id),
  }))

  const body = `# Yaşar Granit

> Manavgat ve Antalya bölgesinde 1999'dan bu yana faaliyet gösteren granit,
> mermer, mermerit ve çimstone üreticisi. Mutfak ve banyo tezgahı, döşeme ve
> duvar kaplama için doğal taş kesim, işleme ve montaj hizmeti verir.

## İşletme Bilgileri

- Firma: Yaşar Granit
- Kuruluş: 1999
- Adres: Alanya Yolu Üzeri Ulualan Mevkii No: 42/1, Manavgat / Antalya, Türkiye
- Telefon: +90 533 731 18 46, +90 536 522 82 61
- E-posta: yasar07600@gmail.com
- Hizmet bölgesi: Manavgat, Antalya ve çevresi
- Çalışma saatleri: Pazartesi-Cumartesi 08:00-18:00
- Web: ${siteUrl}

## Hizmetler

- Granit tezgah üretimi ve montajı
- Mermer döşeme ve kaplama
- Mermerit kaplama uygulamaları
- Çimstone mutfak/banyo tezgahı
- Doğal taş kesim ve işleme

## Fiyatlandırma

Ürünler için sabit liste fiyatı yayınlanmaz. Fiyat; ölçü, malzeme ve
uygulama detayına göre teklif usulü belirlenir. Telefon veya WhatsApp
üzerinden ücretsiz keşif ve fiyat teklifi alınabilir.

## Ürün Kategorileri

${byCategory
  .map(
    (c) =>
      `### ${c.name} (${c.products.length} ürün)\n${siteUrl}/products?category=${c.id}\n${
        c.products.length
          ? c.products.map((p) => `- ${p.name}: ${siteUrl}/products/${p.id}`).join('\n')
          : '- (bu kategoride henüz ürün yok)'
      }`
  )
  .join('\n\n')}

## Önemli Sayfalar

- Ana sayfa: ${siteUrl}
- Tüm ürünler: ${siteUrl}/products
- Örnek uygulamalar: ${siteUrl}/ornek-urunler
- İletişim: ${siteUrl}/iletisim

## Notlar

- Toplam ${products.length} ürün, ${categories.length} kategori listelenmektedir.
- Ürün görselleri ve katalog admin panelinden güncellenir; bu dosya saatlik yenilenir.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
