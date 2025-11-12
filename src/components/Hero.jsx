import React from 'react'

export default function Hero({ onSeeCurrent, onViewArchive }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gray-200/60 blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 ring-1 ring-gray-200">
          🎽 Limited Drop • This Month Only
        </p>
        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Limited Edition T-Shirts — This Month Only
        </h1>
        <p className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Streetwear made for the moment. Authentic, collectible, and planet-conscious drops that never repeat.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={onSeeCurrent} className="px-5 py-3 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors">
            See This Month’s Collection
          </button>
          <button onClick={onViewArchive} className="px-5 py-3 rounded-lg bg-white text-gray-900 ring-1 ring-gray-300 hover:ring-gray-400 transition-all">
            View Archive
          </button>
        </div>
      </div>
    </section>
  )
}
