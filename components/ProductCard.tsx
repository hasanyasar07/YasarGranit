import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  id: string
  name: string
  price: string
  imageUrl: string
  categoryName: string
}

export default function ProductCard({ id, name, price, imageUrl, categoryName }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-64 bg-gray-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{categoryName}</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
          <p className="text-xl font-bold text-blue-600">{price} ₺</p>
        </div>
      </div>
    </Link>
  )
}
