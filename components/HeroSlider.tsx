'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const slides = [
  { src: '/sld1705745210.jpg', text: 'Tecrübe ve Güvenin Adresiyiz' },
  { src: '/sld1705745228.jpg', text: 'Önceliğimiz Müşteri Memnuniyetidir' },
  { src: '/sld1705745279.jpg', text: "99'dan Beri Hizmetinizdeyiz" },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  return (
    <div className="relative w-full h-[260px] sm:h-[380px] md:h-[500px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.src}
            alt={slide.text}
            fill
            className="object-cover"
            priority={i === 0}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end justify-center pb-12 sm:pb-16 px-6">
            <h2 className="text-white text-xl sm:text-3xl md:text-5xl font-bold text-center tracking-wide drop-shadow-xl">
              {slide.text}
            </h2>
          </div>
        </div>
      ))}

      {/* Ok butonları */}
      <button
        onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-10"
        aria-label="Önceki"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-10"
        aria-label="Sonraki"
      >
        ›
      </button>

      {/* Dots */}
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
    </div>
  )
}
