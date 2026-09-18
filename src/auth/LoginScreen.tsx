import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-slate-800 p-6"
      >
        <h1 className="text-xl font-semibold text-slate-100">Hábitos</h1>

        <input
          type="email"
          required
          autoComplete="username"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-sky-500"
        />

        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-sky-500"
        />

        {error && (
          <p className="rounded-lg bg-red-950 px-3 py-2 text-sm text-red-200">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-sky-600 px-3 py-2 font-medium text-white disabled:opacity-50"
        >
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
