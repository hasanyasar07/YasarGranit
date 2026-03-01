'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Category = { id: string; name: string }

export default function NavMenu({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
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

      {/* Mobil: sol hamburger + sağ 3 nokta */}
      <div className="md:hidden flex items-center justify-between w-full">
        {/* Sol: hamburger */}
        <button
          className="flex flex-col justify-center items-center w-9 h-9 gap-1.5"
          onClick={() => { setMenuOpen((v) => !v); setInfoOpen(false) }}
          aria-label="Menü"
        >
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Sağ: 3 nokta */}
        <button
          className="flex flex-col justify-center items-center w-9 h-9 gap-1"
          onClick={() => { setInfoOpen((v) => !v); setMenuOpen(false) }}
          aria-label="İletişim Bilgileri"
        >
          <span className="block w-1 h-1 rounded-full bg-gray-700" />
          <span className="block w-1 h-1 rounded-full bg-gray-700" />
          <span className="block w-1 h-1 rounded-full bg-gray-700" />
        </button>
      </div>

      {/* Mobil: sol menü açılır */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-5 py-3 text-sm font-medium border-b border-gray-50 transition-colors ${
                pathname === link.href
                  ? 'text-stone-900 bg-stone-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      {/* Mobil: sağ 3 nokta açılır - iletişim bilgileri */}
      {infoOpen && (
        <div className="md:hidden absolute top-full right-0 w-72 bg-white border border-gray-100 rounded-bl-xl shadow-xl z-50">
          <div className="p-4 space-y-3">
            <a
              href="tel:+905337311846"
              onClick={() => setInfoOpen(false)}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-stone-900 transition-colors"
            >
              <span className="bg-stone-100 rounded-full p-1.5">
                <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              0533 731 18 46
            </a>
            <a
              href="tel:+905365228261"
              onClick={() => setInfoOpen(false)}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-stone-900 transition-colors"
            >
              <span className="bg-stone-100 rounded-full p-1.5">
                <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              0536 522 82 61
            </a>
            <a
              href="https://www.google.com/maps/dir//ya%C5%9Far+granit/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x14c3570febd560ad:0xfe92c0d9bab9656b?sa=X&ved=2ahUKEwj2mpXci6-CAxUUSPEDHfRdApIQ9Rd6BAg5EAA"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setInfoOpen(false)}
              className="flex items-start gap-3 text-sm text-gray-700 hover:text-stone-900 transition-colors"
            >
              <span className="bg-stone-100 rounded-full p-1.5 shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Alanya Yolu Üzeri Ulualan Mevkii No: 42/1 Manavgat/ANTALYA
            </a>
          </div>
        </div>
      )}
    </>
  )
}
