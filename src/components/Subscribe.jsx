import React, { useState } from 'react'

export default function Subscribe() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState(null)

  const backend = import.meta.env.VITE_BACKEND_URL

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`${backend}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      })
      const data = await res.json()
      if (data.status === 'ok') setStatus('success')
      else setStatus('error')
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="p-8 bg-white rounded-2xl ring-1 ring-gray-200 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900">Get notified for new drops</h3>
        <p className="mt-2 text-gray-600">Monthly releases only. No spam, ever.</p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="sm:col-span-2 w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="sm:col-span-3 w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="sm:col-span-1 w-full rounded-lg bg-black text-white hover:bg-gray-900 transition-colors"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Submitting...' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <p className="mt-3 text-sm text-green-600">You\'re in! We\'ll email you on the next drop.</p>
        )}
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-600">Something went wrong. Try again later.</p>
        )}
      </div>
    </section>
  )
}
