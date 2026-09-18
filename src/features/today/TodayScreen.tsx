import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTodayHabits, habitStep, habitUndo } from '../../lib/queries'
import type { TodayHabit } from '../../lib/database.types'
import { classify } from '../../lib/errors'
import { supabase } from '../../lib/supabase'
import { HabitRow } from './HabitRow'

const KEY = ['today-habits']

export function TodayScreen() {
  const client = useQueryClient()

  const habits = useQuery({
    queryKey: KEY,
    queryFn: fetchTodayHabits,
    staleTime: 60_000,
  })

  // El valor nuevo lo devuelve siempre la RPC: la pantalla lo escribe en su
  // sitio y NO invalida la consulta, para que la fila no se mueva ni
  // desaparezca bajo el dedo entre dos pulsaciones seguidas. El refetch real
  // (al volver a la pestaña, o pasado el staleTime) es quien reordena.
  const apply = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'step' | 'undo' }) =>
      action === 'step' ? habitStep(id) : habitUndo(id),
    onSuccess: (value, { id }) => {
      client.setQueryData<TodayHabit[]>(KEY, (previous) =>
        previous?.map((habit) =>
          habit.id === id
            ? { ...habit, current_value: value, done: value >= habit.goal }
            : habit,
        ),
      )
    },
  })

  const error = habits.error ?? apply.error

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg p-4">
      <header className="mb-4 flex items-baseline justify-between">
        <h1 className="text-xl font-semibold text-slate-100">Hoy</h1>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-slate-500 hover:text-slate-300"
        >
          Salir
        </button>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-950 px-3 py-2 text-sm text-red-200">
          {classify(error).message}
        </p>
      )}

      {habits.isPending && <p className="text-slate-400">Cargando hábitos…</p>}

      {habits.data?.length === 0 && (
        <p className="text-slate-400">Hoy no toca ningún hábito.</p>
      )}

      <ul className="space-y-2">
        {habits.data?.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            pending={apply.isPending && apply.variables?.id === habit.id}
            onStep={() => apply.mutate({ id: habit.id, action: 'step' })}
            onUndo={() => apply.mutate({ id: habit.id, action: 'undo' })}
          />
        ))}
      </ul>
    </div>
  )
}
