import { supabase } from './supabase'
import type { TodayHabit } from './database.types'

// La unica capa que habla PostgREST. Todo lo demas de la app llama aqui.
//
// habits-core manda: ninguna de estas funciones calcula nada -- ni que dia es
// hoy, ni cual es el siguiente valor de un habito. Eso lo decide la base.

export async function fetchTodayHabits(): Promise<TodayHabit[]> {
  const { data, error } = await supabase
    .from('v_today_habits')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data
}

export async function habitStep(habitId: string): Promise<number> {
  const { data, error } = await supabase.rpc('habit_step', { p_habit_id: habitId })
  if (error) throw error
  return data
}

export async function habitUndo(habitId: string): Promise<number> {
  const { data, error } = await supabase.rpc('habit_undo', { p_habit_id: habitId })
  if (error) throw error
  return data
}
