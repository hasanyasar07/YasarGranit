import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Yaşar Granit" width={160} height={50} className="object-contain" />
          </Link>
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
