import { useEffect, useMemo, useState } from 'react'

function useApiBase() {
  return useMemo(() => {
    const env = import.meta.env.VITE_BACKEND_URL
    if (env && typeof env === 'string' && env.trim() !== '') return env
    try {
      const url = new URL(window.location.href)
      // Assume backend runs on 8000 in same host
      url.port = '8000'
      return url.origin
    } catch {
      return ''
    }
  }, [])
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  )
}

function ProductCard({ item, onClick }) {
  return (
    <button
      onClick={() => onClick(item)}
      className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div className="p-4 text-left">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
          <span className="text-sm font-medium text-purple-600">${item.price?.toFixed(2)}</span>
        </div>
        <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>
      </div>
    </button>
  )
}

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {children}
      </div>
    </div>
  )
}

function SubscriptionForm({ onSuccess }) {
  const API = useApiBase()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${API}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) throw new Error('Failed to subscribe')
      setMessage('You are in. We will email you when the next drop is live!')
      setEmail('')
      onSuccess?.()
    } catch (err) {
      setMessage('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-md items-center gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-xl border border-gray-300 bg-white/60 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Subscribe'}
      </button>
      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
    </form>
  )
}

function App() {
  const API = useApiBase()
  const [current, setCurrent] = useState([])
  const [archive, setArchive] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const monthKey = useMemo(() => {
    const d = new Date()
    return d.toLocaleString(undefined, { month: 'long', year: 'numeric' })
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [a, b] = await Promise.all([
        fetch(`${API}/api/tees/current`).then((r) => r.json()),
        fetch(`${API}/api/tees/archive`).then((r) => r.json()),
      ])
      setCurrent(Array.isArray(a) ? a : [])
      setArchive(Array.isArray(b) ? b : [])
    } catch (e) {
      setError('Unable to load products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API])

  const seedSample = async () => {
    try {
      await fetch(`${API}/api/seed`, { method: 'POST' })
      await fetchAll()
    } catch {}
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-900" />
            <span className="font-semibold tracking-tight">Limited Edition Tees</span>
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#this-month" className="text-gray-600 hover:text-gray-900">This Month</a>
            <a href="#why" className="text-gray-600 hover:text-gray-900">Why Limited</a>
            <a href="#archive" className="text-gray-600 hover:text-gray-900">Archive</a>
            <a href="#subscribe" className="text-gray-600 hover:text-gray-900">Subscribe</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Limited Edition T-Shirts — This Month Only.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-600">
              Drop-based streetwear for the ones who move first. New designs monthly. Once they’re gone, they’re gone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#this-month" className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700">See This Month’s Collection</a>
              <a href="#archive" className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-gray-400">View Archive</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-purple-100 ring-1 ring-gray-200">
              <img
                src="https://images.unsplash.com/photo-1520975922375-2b1bcd0b3cb0?q=80&w=1200&auto=format&fit=crop"
                alt="Streetwear teaser"
                className="h-full w-full object-cover mix-blend-multiply"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 hidden rounded-xl bg-white px-3 py-2 shadow md:block">
              <Badge>{monthKey} Drop</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* This Month */}
      <section id="this-month" className="border-t border-gray-100 bg-gray-50/50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">This Month’s Collection</h2>
              <p className="mt-1 text-sm text-gray-600">Available during {monthKey}</p>
            </div>
          </div>
          {loading ? (
            <p className="text-gray-600">Loading products…</p>
          ) : current.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {current.map((item) => (
                <ProductCard key={item.slug} item={item} onClick={setSelected} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">
              <p>No products available yet this month.</p>
              <button onClick={seedSample} className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">Load sample data</button>
            </div>
          )}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </section>

      {/* Why Limited */}
      <section id="why" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Why Limited?</h2>
            <p className="mt-2 max-w-2xl text-gray-600">
              We design with intention and produce in small batches. That means real exclusivity, pieces worth collecting, and a lighter footprint on the planet.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow">
              <h3 className="font-semibold">Authenticity</h3>
              <p className="mt-2 text-sm text-gray-600">Original designs, premium fabrics, and a craft-first mindset. No mass production.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow">
              <h3 className="font-semibold">Collectibility</h3>
              <p className="mt-2 text-sm text-gray-600">Each drop is timestamped and never restocked. Wear it now, archive it forever.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow">
              <h3 className="font-semibold">Environment</h3>
              <p className="mt-2 text-sm text-gray-600">Small runs reduce waste. We make only what the community loves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Archive */}
      <section id="archive" className="border-t border-gray-100 bg-gray-50/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Archive — Old Batches</h2>
              <p className="mt-1 text-sm text-gray-600">Discontinued designs with their original release month.</p>
            </div>
          </div>
          {archive.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {archive.map((item) => (
                <div key={item.slug} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-50">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-600">Released {item.month}</p>
                    </div>
                    <Badge>Discontinued</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No archived products yet.</p>
          )}
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-gray-50 p-10 ring-1 ring-gray-200">
            <h2 className="text-2xl font-bold">Get the drop first</h2>
            <p className="mt-2 max-w-2xl text-gray-600">Join the list for early access and monthly release reminders.</p>
            <SubscriptionForm onSuccess={() => {}} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-gray-600 md:flex-row">
          <p>© {new Date().getFullYear()} Limited Edition Tees. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-square bg-gray-50">
              {selected.image ? (
                <img src={selected.image} alt={selected.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">No image</div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold">{selected.name}</h3>
                <button onClick={() => setSelected(null)} className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">✕</button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{selected.description}</p>
              <div className="mt-4 text-xl font-semibold text-purple-700">${selected.price?.toFixed(2)}</div>
              {selected.sizes?.length ? (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500">Sizes</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.sizes.map((s) => (
                      <span key={s} className="rounded-lg border border-gray-300 px-3 py-1 text-sm">{s}</span>
                    ))}
                  </div>
                </div>
              ) : null}
              {selected.colors?.length ? (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500">Colors</p>
                  <div className="mt-2 flex items-center gap-2">
                    {selected.colors.map((c) => (
                      <span key={c} className="h-6 w-6 rounded-full border border-gray-300" style={{ background: c }} />
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black">Add to Bag</button>
                <button onClick={() => setSelected(null)} className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:border-gray-400">Close</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default App
