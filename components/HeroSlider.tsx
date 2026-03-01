'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  {
    src: '/sld1705745210.jpg',
    text: 'Tecrübe ve Güvenin Adresiyiz',
  },
  {
    src: '/sld1705745228.jpg',
    text: 'Önceliğimiz Müşteri Memnuniyetidir',
  },
  {
    src: '/sld1705745279.jpg',
    text: "99'dan Beri Hizmetinizdeyiz",
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[480px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.src}
            alt={slide.text}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-4xl md:text-5xl font-bold text-center px-6 drop-shadow-lg">
              {slide.text}
            </h2>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === current ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  )
}
