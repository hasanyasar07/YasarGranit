'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type Slide = {
  id: string
  imageUrl: string
  text: string
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, slides.length])

  if (slides.length === 0) return null

  return (
    <div className="relative w-full h-[260px] sm:h-[380px] md:h-[500px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.text}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end justify-center pb-12 sm:pb-16 px-6">
            <h2 className="text-white text-xl sm:text-3xl md:text-5xl font-bold text-center tracking-wide drop-shadow-xl">
              {slide.text}
            </h2>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 active:bg-white/50 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors z-10"
            aria-label="Önceki"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 active:bg-white/50 backdrop-blur-sm text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors z-10"
            aria-label="Sonraki"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
