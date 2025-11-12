import React from 'react'

export default function InfoBlocks() {
  const items = [
    {
      title: 'Authenticity',
      text: 'Each piece is designed for the moment and never reprinted. You get what others can\'t.',
    },
    {
      title: 'Collectibility',
      text: 'Every month is a new story. Track drops, build your rotation, and flex your archive.',
    },
    {
      title: 'Environmental Friendly',
      text: 'Small-batch manufacturing means less waste and smarter consumption.',
    },
  ]

  return (
    <section className="bg-gray-50 border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-8">
        {items.map((it) => (
          <div key={it.title} className="p-6 rounded-xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900">{it.title}</h3>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
