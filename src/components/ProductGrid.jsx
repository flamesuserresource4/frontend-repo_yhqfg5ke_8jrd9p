import React from 'react'

export default function ProductGrid({ title, items = [], onSelect }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12" id={title?.toLowerCase().replace(/\s+/g, '-') }>
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      {items.length === 0 ? (
        <div className="text-gray-500 text-center py-16">Nothing here yet. Check back soon.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <button key={p.id || p.slug} onClick={() => onSelect?.(p)} className="group text-left">
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{p.title}</p>
                  <p className="text-sm text-gray-500">${p.price?.toFixed?.(2) || p.price}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                  {p.release_month}/{p.release_year}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
