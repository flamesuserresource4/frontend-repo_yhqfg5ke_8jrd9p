import React from 'react'

export default function ProductModal({ open, product, onClose }) {
  if (!open || !product) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-20 md:top-24 max-w-2xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
        <div className="grid md:grid-cols-2">
          <div className="aspect-square bg-gray-100">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900">{product.title}</h3>
            <p className="mt-1 text-gray-600">${product.price?.toFixed?.(2) || product.price}</p>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description || 'No description provided.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(product.colors || []).map((c) => (
                <span key={c} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 ring-1 ring-gray-200">{c}</span>
              ))}
            </div>
            <button onClick={onClose} className="mt-6 inline-flex px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
