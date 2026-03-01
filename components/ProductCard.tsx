import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  imageUrl: string
  categoryName: string
}

export default function ProductCard({ id, name, imageUrl, categoryName }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-stone-300 hover:shadow-lg transition-all duration-300">
        <div className="relative h-40 sm:h-52 md:h-60 bg-gray-50 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-3 md:p-4 border-t border-gray-100">
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-stone-400 mb-0.5">{categoryName}</p>
          <h3 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">{name}</h3>
        </div>
      </div>
    </Link>
  )
}
