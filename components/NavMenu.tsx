'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Category = { id: string; name: string }

export default function NavMenu({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [phoneOpen, setPhoneOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { name: 'Ana Sayfa', href: '/' },
    ...categories.map((c) => ({ name: c.name, href: `/products?category=${c.id}` })),
    { name: 'Örnek Ürünler', href: '/ornek-urunler' },
    { name: 'İletişim', href: '/iletisim' },
  ]

  return (
    <>
      {/* Masaüstü menü */}
      <nav className="hidden md:flex items-center gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              pathname === link.href
                ? 'text-stone-900 bg-stone-100'
                : 'text-gray-600 hover:text-stone-900 hover:bg-gray-50'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobil: hamburger butonu */}
      <div className="md:hidden flex items-center justify-between w-full">
        <button
          className="flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menü"
        >
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Sağ: telefon butonu */}
        <div className="relative">
          <button
            onClick={() => { setPhoneOpen((v) => !v); setMenuOpen(false) }}
            className="flex items-center justify-center w-10 h-10 text-stone-600 active:bg-stone-50 rounded-full"
            aria-label="Bizi Arayın"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          {phoneOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setPhoneOpen(false)} />
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[200px]">
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-stone-400 uppercase tracking-wide">Bizi Arayın</p>
                <a
                  href="tel:+905337311846"
                  onClick={() => setPhoneOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 active:bg-stone-50"
                >
                  <span className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">0533 731 18 46</span>
                </a>
                <a
                  href="tel:+905365228261"
                  onClick={() => setPhoneOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 border-t border-gray-50 active:bg-stone-50"
                >
                  <span className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">0536 522 82 61</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobil: tam ekran menü */}
      {menuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-50">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-4 text-sm font-medium border-b border-gray-50 transition-colors ${
                  pathname === link.href
                    ? 'text-stone-900 bg-stone-50'
                    : 'text-gray-700 active:bg-gray-50'
                }`}
              >
                {link.name}
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
            {/* İletişim bilgileri menü altında */}
            <div className="px-5 py-4 bg-stone-50 space-y-3">
              <a href="tel:+905337311846" className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                0533 731 18 46
              </a>
              <a href="tel:+905365228261" className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                0536 522 82 61
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
