'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Ürünler', href: '/admin/dashboard/products' },
    { name: 'Kategoriler', href: '/admin/dashboard/categories' },
    { name: 'Site Ayarları', href: '/admin/dashboard/settings' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <form action={logout}>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
