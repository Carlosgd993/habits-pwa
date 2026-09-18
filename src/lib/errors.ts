import type { PostgrestError } from '@supabase/supabase-js'

// Las mismas tres familias que clasifica el daemon de la Stream Deck, para que
// un fallo se lea igual desde el deck que desde aqui.
export type ErrorKind = 'auth' | 'network' | 'api'

export type AppError = {
  kind: ErrorKind
  message: string
}

const MESSAGES: Record<ErrorKind, string> = {
  auth: 'Sesión caducada o sin permisos. Vuelve a iniciar sesión.',
  network: 'Sin conexión con Supabase.',
  api: 'La base respondió con un error.',
}

export function classify(error: unknown): AppError {
  if (error instanceof TypeError) {
    return { kind: 'network', message: MESSAGES.network }
  }

  const code = (error as PostgrestError | null)?.code
  const status = (error as { status?: number } | null)?.status

  // PGRST301 = JWT invalido o caducado. 42501 = permiso denegado, que aqui
  // significa que a la vista o la RPC le falta su grant para este rol.
  if (code === 'PGRST301' || code === '42501' || status === 401 || status === 403) {
    return { kind: 'auth', message: MESSAGES.auth }
  }

  const detail = (error as Error | null)?.message
  return { kind: 'api', message: detail ? `${MESSAGES.api} ${detail}` : MESSAGES.api }
}
