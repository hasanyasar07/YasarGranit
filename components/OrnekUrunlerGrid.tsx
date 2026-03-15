'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Item = {
  id: string
  imageUrl: string
  product: { id: string; name: string; category: { name: string } }
}

export default function OrnekUrunlerGrid({ items }: { items: Item[] }) {
  const [zoomed, setZoomed] = useState<Item | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-stone-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setZoomed(item)}
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

      {/* Zoom Modal */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setZoomed(null)}
        >
          <div
            className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobil handle */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="relative w-full aspect-square bg-gray-50">
              <Image
                src={zoomed.imageUrl}
                alt={zoomed.product.name}
                fill
                className="object-cover"
              />
            </div>

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
                  onClick={() => setZoomed(null)}
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
