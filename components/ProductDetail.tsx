'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  product: {
    id: string
    name: string
    imageUrl: string
    category: { name: string }
  }
  whatsappLink: string
  showWhatsapp: boolean
  ornekUrunler: { id: string; imageUrl: string }[]
}

const WA_ICON = (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function ProductDetail({ product, whatsappLink, showWhatsapp, ornekUrunler }: Props) {
  const [zoomedMain, setZoomedMain] = useState(false)
  const [slideIndex, setSlideIndex] = useState<number | null>(null)

  const ornekImages = ornekUrunler.map((o) => o.imageUrl)

  const prev = useCallback(() => {
    setSlideIndex((i) => (i !== null ? (i - 1 + ornekImages.length) % ornekImages.length : null))
  }, [ornekImages.length])

  const next = useCallback(() => {
    setSlideIndex((i) => (i !== null ? (i + 1) % ornekImages.length : null))
  }, [ornekImages.length])

  useEffect(() => {
    if (slideIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') setSlideIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slideIndex, prev, next])

  const [touchStart, setTouchStart] = useState<number | null>(null)
  function onTouchStart(e: React.TouchEvent) { setTouchStart(e.touches[0].clientX) }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    setTouchStart(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Ürün resmi */}
        <div
          className="relative h-72 sm:h-96 md:h-[520px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in"
          onClick={() => setZoomedMain(true)}
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute bottom-3 right-3 bg-black/40 rounded-full p-1.5">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>

        {/* Ürün bilgisi */}
        <div className="flex flex-col justify-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{product.category.name}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          </div>

          <div className="h-px bg-gray-100" />

          <p className="text-sm text-gray-500 leading-relaxed">
            Bu ürün hakkında detaylı bilgi ve fiyat teklifi almak için WhatsApp üzerinden bize ulaşabilirsiniz.
          </p>

          {ornekUrunler.length > 0 && (
            <Link
              href={`/ornek-urunler?product=${product.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-4 py-3 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Bu ürüne ait {ornekUrunler.length} örnek çalışma görüntüle
            </Link>
          )}

          {showWhatsapp && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl transition-colors text-sm w-full shadow-sm shadow-green-200"
            >
              {WA_ICON}
              WhatsApp ile Teklif Al
            </a>
          )}
        </div>
      </div>

      {/* Örnek çalışmalar grid */}
      {ornekUrunler.length > 0 && (
        <div className="mt-10 md:mt-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">Referanslar</p>
              <h2 className="text-xl font-bold text-gray-900">Örnek Çalışmalar</h2>
            </div>
            <Link
              href="/ornek-urunler"
              className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              Tümünü gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {ornekUrunler.map((ornek, idx) => (
              <div
                key={ornek.id}
                className="relative h-36 md:h-48 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 cursor-zoom-in"
                onClick={() => setSlideIndex(idx)}
              >
                <Image
                  src={ornek.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobilde sabit WhatsApp butonu */}
      {showWhatsapp && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm border-t border-gray-100 z-40 safe-area-bottom">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 active:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl text-sm w-full shadow-sm shadow-green-200"
          >
            {WA_ICON}
            WhatsApp ile Teklif Al
          </a>
        </div>
      )}

      {/* Ana resim zoom */}
      {zoomedMain && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setZoomedMain(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomedMain(false)}
              className="absolute -top-10 right-0 text-white text-3xl font-bold"
            >
              &times;
            </button>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-xl mx-auto block"
            />
          </div>
        </div>
      )}

      {/* Örnek çalışmalar slide modal */}
      {slideIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setSlideIndex(null)}
        >
          {/* Üst bar */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <span className="text-white/70 text-sm font-medium">
              {slideIndex + 1} / {ornekImages.length}
            </span>
            <button
              onClick={() => setSlideIndex(null)}
              className="w-9 h-9 flex items-center justify-center text-white/80 active:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Resim */}
          <div className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={ornekImages[slideIndex]}
              alt={product.name}
              fill
              className="object-contain"
            />

            {ornekImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 active:bg-black/70 rounded-full flex items-center justify-center text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 active:bg-black/70 rounded-full flex items-center justify-center text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Küçük resim şeridi */}
          {ornekImages.length > 1 && (
            <div
              className="flex gap-2 px-4 py-3 overflow-x-auto flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {ornekImages.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === slideIndex ? 'border-white' : 'border-transparent opacity-50'
                  }`}
                >
                  <Image src={url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
