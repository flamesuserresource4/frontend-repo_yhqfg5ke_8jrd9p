import React, { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import InfoBlocks from './components/InfoBlocks'
import Subscribe from './components/Subscribe'
import ProductModal from './components/ProductModal'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function App() {
  const [current, setCurrent] = useState([])
  const [archive, setArchive] = useState([])
  const [selected, setSelected] = useState(null)

  const [view, setView] = useState('home') // home | current | archive

  const monthYearLabel = useMemo(() => {
    const d = new Date()
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, aRes] = await Promise.all([
          fetch(`${BACKEND}/api/tees/current`),
          fetch(`${BACKEND}/api/tees/archive`)
        ])
        const [cData, aData] = await Promise.all([cRes.json(), aRes.json()])

        // If backend has no data yet, provide a small client-side fallback sample
        const sampleMonth = new Date().getMonth() + 1
        const sampleYear = new Date().getFullYear()
        const sample = [
          {
            id: 'sample-1',
            slug: 'noir-basic',
            title: 'NOIR BASIC TEE',
            description: 'Matte black heavyweight cotton with tonal logo embroidery.',
            price: 38,
            colors: ['Black'],
            image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop',
            release_month: sampleMonth,
            release_year: sampleYear,
          },
          {
            id: 'sample-2',
            slug: 'ultraviolet-arc',
            title: 'ULTRAVIOLET ARC',
            description: 'Vibrant purple arc-print tee with soft-hand feel.',
            price: 42,
            colors: ['Purple'],
            image_url: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1200&auto=format&fit=crop',
            release_month: sampleMonth,
            release_year: sampleYear,
          },
        ]

        setCurrent(Array.isArray(cData) && cData.length ? cData : sample)
        setArchive(Array.isArray(aData) ? aData : [])
      } catch (e) {
        // Offline fallback
        setCurrent([])
        setArchive([])
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold tracking-tight">Limited Edition Tees</a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => setView('current')} className={`hover:text-purple-600 transition-colors ${view==='current'?'text-purple-600 font-semibold':''}`}>This Month</button>
            <button onClick={() => setView('archive')} className={`hover:text-purple-600 transition-colors ${view==='archive'?'text-purple-600 font-semibold':''}`}>Archive</button>
            <a href="#subscribe" className="hover:text-purple-600 transition-colors">Subscribe</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <Hero onSeeCurrent={() => setView('current')} onViewArchive={() => setView('archive')} />

      {/* Current month */}
      <ProductGrid
        title={`This Month — ${monthYearLabel}`}
        items={current}
        onSelect={(p) => setSelected(p)}
      />

      {/* Why section */}
      <InfoBlocks />

      {/* Archive */}
      <ProductGrid
        title="Archive"
        items={archive}
        onSelect={(p) => setSelected(p)}
      />

      {/* Subscribe */}
      <div id="subscribe">
        <Subscribe />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Limited Edition Tees. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <ProductModal open={!!selected} product={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
