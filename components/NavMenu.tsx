'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Category = { id: string; name: string }

export default function NavMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { name: 'Ana Sayfa', href: '/' },
    ...categories.map((c) => ({ name: c.name, href: `/products?category=${c.id}` })),
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

      {/* Hamburger butonu - sadece mobil */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menü"
      >
        <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobil açılır menü */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
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
    </>
  )
}
