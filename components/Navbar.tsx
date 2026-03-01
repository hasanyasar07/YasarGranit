import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/actions/category'
import NavMenu from './NavMenu'

export default async function Navbar() {
  const categories = await getCategories()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Üst bilgi çubuğu - sadece masaüstü */}
        <div className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-gray-500 mb-2 border-b border-gray-100 pb-2">
          <a href="tel:+905337311846" className="flex items-center gap-1 hover:text-stone-700 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            0533 731 18 46
          </a>
          <a href="tel:+905365228261" className="flex items-center gap-1 hover:text-stone-700 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            0536 522 82 61
          </a>
          <a
            href="https://www.google.com/maps/dir//ya%C5%9Far+granit/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x14c3570febd560ad:0xfe92c0d9bab9656b?sa=X&ved=2ahUKEwj2mpXci6-CAxUUSPEDHfRdApIQ9Rd6BAg5EAA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-stone-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Alanya Yolu Üzeri Ulualan Mevkii No: 42/1 Manavgat/ANTALYA
          </a>
        </div>

        {/* Logo + menü */}
        <div className="relative flex items-center justify-between">
          {/* Masaüstü: logo solda */}
          <Link href="/" className="hidden md:block shrink-0">
            <Image src="/logo.png" alt="Yaşar Granit" width={100} height={32} className="object-contain" />
          </Link>

          {/* Mobil: logo ortada (absolute) */}
          <Link href="/" className="md:hidden absolute left-1/2 -translate-x-1/2">
            <Image src="/logo.png" alt="Yaşar Granit" width={88} height={28} className="object-contain" />
          </Link>

          <NavMenu categories={categories} />
        </div>
      </div>
    </header>
  )
}
