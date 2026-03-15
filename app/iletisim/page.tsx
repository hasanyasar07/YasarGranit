export const metadata = {
  title: 'İletişim - Yaşar Granit',
  description: 'Yaşar Granit iletişim bilgileri ve konum.',
}

export default function IletisimPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">Bize Ulaşın</p>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">İletişim</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Telefon */}
        <div className="bg-stone-50 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-stone-200 rounded-full p-2">
              <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-900">Telefon</h2>
          </div>
          <div className="flex flex-col gap-2">
            <a href="tel:+905337311846" className="text-gray-700 hover:text-stone-900 font-medium transition-colors">
              0533 731 18 46
            </a>
            <a href="tel:+905365228261" className="text-gray-700 hover:text-stone-900 font-medium transition-colors">
              0536 522 82 61
            </a>
          </div>
        </div>

        {/* E-posta */}
        <div className="bg-stone-50 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-stone-200 rounded-full p-2">
              <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-900">E-posta</h2>
          </div>
          <a href="mailto:yasar07600@gmail.com" className="text-gray-700 hover:text-stone-900 font-medium transition-colors">
            yasar07600@gmail.com
          </a>
        </div>

        {/* Adres */}
        <div className="bg-stone-50 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-stone-200 rounded-full p-2">
              <svg className="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-900">Adres</h2>
          </div>
          <a
            href="https://www.google.com/maps/dir//ya%C5%9Far+granit/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x14c3570febd560ad:0xfe92c0d9bab9656b?sa=X&ved=2ahUKEwj2mpXci6-CAxUUSPEDHfRdApIQ9Rd6BAg5EAA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-stone-900 font-medium transition-colors leading-relaxed"
          >
            Alanya Yolu Üzeri Ulualan Mevkii No: 42/1 Manavgat/ANTALYA
          </a>
        </div>
      </div>

      {/* Harita */}
      <div className="mt-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.123456789!2d31.4!3d36.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c3570febd560ad%3A0xfe92c0d9bab9656b!2sYa%C5%9Far%20Granit!5e0!3m2!1str!2str!4v1234567890"
          width="100%"
          height="320"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Yaşar Granit Konum"
        />
      </div>
    </div>
  )
}
