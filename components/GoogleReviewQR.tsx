'use client'

import { QRCodeSVG } from 'qrcode.react'

const reviewUrl =
  'https://search.google.com/local/writereview?placeid=ChIJrWDV6w9XwxQRa2W5utnAkv4&hl=tr'

export default function GoogleReviewQR() {
  return (
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col items-center gap-4 active:bg-stone-50 transition-colors">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <p className="text-base font-bold text-gray-900">Google&apos;da Yorum Yaz</p>
          <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <QRCodeSVG
          value={reviewUrl}
          size={180}
          bgColor="#ffffff"
          fgColor="#1c1917"
          level="M"
          marginSize={1}
        />
        <p className="text-xs text-stone-400 text-center">
          QR kodu okutun veya tıklayın
        </p>
      </div>
    </a>
  )
}
