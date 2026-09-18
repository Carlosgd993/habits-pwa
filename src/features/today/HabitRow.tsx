import type { TodayHabit } from '../../lib/database.types'

type Props = {
  habit: TodayHabit
  pending: boolean
  onStep: () => void
  onUndo: () => void
}

export function HabitRow({ habit, pending, onStep, onUndo }: Props) {
  const progress = habit.goal > 0 ? Math.min(habit.current_value / habit.goal, 1) : 0
  const accent = habit.color ?? '#38bdf8'

  return (
    <li
      className={`flex items-center gap-3 rounded-xl bg-slate-800 p-3 transition-opacity ${
        pending ? 'opacity-60' : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className={`truncate font-medium ${
              habit.done ? 'text-slate-500 line-through' : 'text-slate-100'
            }`}
          >
            {habit.name}
          </span>
          <span className="shrink-0 tabular-nums text-sm text-slate-400">
            {formatValue(habit.current_value)}/{formatValue(habit.goal)}
            {habit.unit ? ` ${habit.unit}` : ''}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full transition-[width] duration-200"
            style={{ width: `${progress * 100}%`, backgroundColor: accent }}
          />
        </div>

        {habit.section_name && (
          <span className="mt-1 block text-xs text-slate-500">{habit.section_name}</span>
        )}
      </div>

      <button
        type="button"
        onClick={onUndo}
        disabled={pending || habit.current_value <= 0}
        aria-label={`Deshacer ${habit.name}`}
        className="size-9 shrink-0 rounded-lg bg-slate-700 text-lg text-slate-300 disabled:opacity-30"
      >
        −
      </button>

      <button
        type="button"
        onClick={onStep}
        disabled={pending || habit.manual_entry}
        aria-label={`Sumar ${habit.name}`}
        title={habit.manual_entry ? 'Hábito de entrada manual: pendiente de la fase 2' : undefined}
        className="size-9 shrink-0 rounded-lg text-lg font-semibold text-white disabled:opacity-30"
        style={{ backgroundColor: accent }}
      >
        +
      </button>
    </li>
  )
}

function formatValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}
