import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/logo.png" alt="Yaşar Granit" width={160} height={50} className="object-contain" />
            </Link>
            <div className="flex flex-col text-sm font-medium">
              <a href="tel:+905337311846" className="text-gray-800 hover:text-blue-600 transition-colors">0533 731 18 46</a>
              <a href="tel:+905365228261" className="text-gray-800 hover:text-blue-600 transition-colors">0536 522 82 61</a>
            </div>
            <a
              href="https://www.google.com/maps/dir//yaşar+granit/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x14c3570febd560ad:0xfe92c0d9bab9656b?sa=X&ved=2ahUKEwj2mpXci6-CAxUUSPEDHfRdApIQ9Rd6BAg5EAA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors max-w-[200px] leading-snug"
            >
              Alanya Yolu Üzeri Ulualan Mevkii No: 42/1 Manavgat/ANTALYA
            </a>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Ürünler
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
