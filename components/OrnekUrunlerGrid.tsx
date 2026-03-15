'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Item = {
  id: string
  imageUrl: string
  product: { id: string; name: string; category: { name: string } }
}

export default function OrnekUrunlerGrid({ items }: { items: Item[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const zoomed = activeIndex !== null ? items[activeIndex] : null

  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : null))
  }, [items.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i + 1) % items.length : null))
  }, [items.length])

  // Klavye desteği
  useEffect(() => {
    if (activeIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') setActiveIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, prev, next])

  // Swipe desteği
  const [touchStart, setTouchStart] = useState<number | null>(null)

  function onTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX)
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    setTouchStart(null)
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-stone-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setActiveIndex(idx)}
          >
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
              <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">
                {item.product.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Slayt Modal */}
      {zoomed && activeIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Mobil handle */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Resim + ok butonları */}
            <div className="relative w-full aspect-square bg-gray-50">
              <Image
                src={zoomed.imageUrl}
                alt={zoomed.product.name}
                fill
                className="object-cover"
              />

              {/* Sayaç */}
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {activeIndex + 1} / {items.length}
              </div>

              {/* Sol ok */}
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 active:bg-black/70 rounded-full flex items-center justify-center text-white"
                aria-label="Önceki"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Sağ ok */}
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 active:bg-black/70 rounded-full flex items-center justify-center text-white"
                aria-label="Sonraki"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Nokta göstergeleri */}
            {items.length > 1 && (
              <div className="flex justify-center gap-1.5 pt-3 px-4">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex ? 'bg-stone-800 w-5' : 'bg-gray-300 w-1.5'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Bilgi ve butonlar */}
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                {zoomed.product.category.name}
              </p>
              <h3 className="text-base font-bold text-gray-900 mb-4">{zoomed.product.name}</h3>
              <div className="flex gap-3">
                <Link
                  href={`/products/${zoomed.product.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-white py-3 rounded-xl font-semibold text-sm active:bg-stone-700"
                >
                  Ürüne Git
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <button
                  onClick={() => setActiveIndex(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-sm active:bg-gray-200"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
