// Tipos del contrato de habits-core.
//
// Generados con el MCP de Supabase (`generate_typescript_types`) y despues
// PODADOS a proposito: aqui solo estan las 8 vistas y las 12 funciones que el
// contrato expone. Las tablas base salen en la generacion completa pero no se
// incluyen, porque estan cerradas con RLS y sin grant: tenerlas aqui solo
// serviria para que el autocompletado sugiera consultas que responden 401.
//
// Al ampliar el contrato en habits-core, regenerar y volver a podar.

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.5' }
  public: {
    Tables: Record<never, never>
    Views: {
      v_today_habits: {
        Row: {
          id: string
          name: string
          icon_res: string | null
          color: string | null
          type: string
          goal: number
          step: number
          unit: string | null
          sort_order: number
          section_id: string | null
          current_value: number
          done: boolean
          day: string
          manual_entry: boolean
          section_name: string | null
        }
        Relationships: []
      }
      v_log_habits: {
        Row: {
          id: string
          name: string
          icon_res: string | null
          color: string | null
          type: string
          unit: string | null
          sort_order: number
          section_id: string | null
          current_value: number
          day: string
        }
        Relationships: []
      }
      v_today_tasks: {
        Row: {
          id: string
          title: string
          priority: number
          project_id: string
          sort_order: number
          due_date: string | null
          template_id: string | null
          due_day: string | null
          overdue: boolean
          day: string
          project_name: string | null
        }
        Relationships: []
      }
      v_templates: {
        Row: {
          id: string
          title: string
          project_id: string | null
          priority: number
          schedule_type: string
          interval_n: number
          bymonthday: number | null
          subtask_count: number
          created_at: string
          show_in_deck: boolean
        }
        Relationships: []
      }
      v_timer_labels: {
        Row: {
          id: string
          name: string
          color: string | null
          sort_order: number
          show_in_deck: boolean
        }
        Relationships: []
      }
      v_running_timer: {
        Row: {
          id: string
          task_id: string | null
          label_id: string | null
          title: string
          started_at: string
        }
        Relationships: []
      }
      v_timer_daily_totals: {
        Row: {
          task_id: string | null
          label_id: string | null
          seconds_today: number
        }
        Relationships: []
      }
      v_task_timer_totals: {
        Row: {
          task_id: string
          seconds_total: number
        }
        Relationships: []
      }
    }
    Functions: {
      app_today: { Args: never; Returns: string }
      app_timezone: { Args: never; Returns: string }
      habit_step: { Args: { p_habit_id: string }; Returns: number }
      habit_set: { Args: { p_habit_id: string; p_value: number }; Returns: number }
      habit_undo: { Args: { p_habit_id: string }; Returns: number }
      instantiate_task: { Args: { p_template_id: string; p_due?: string }; Returns: string }
      complete_task: { Args: { p_task_id: string }; Returns: undefined }
      uncomplete_task: { Args: { p_task_id: string }; Returns: undefined }
      skip_task: { Args: { p_task_id: string }; Returns: undefined }
      unskip_task: { Args: { p_task_id: string }; Returns: undefined }
      set_task_priority: { Args: { p_task_id: string; p_priority: number }; Returns: undefined }
      timer_toggle: { Args: { p_task_id?: string; p_label_id?: string }; Returns: undefined }
    }
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type TodayHabit = Database['public']['Views']['v_today_habits']['Row']
export type LogHabit = Database['public']['Views']['v_log_habits']['Row']
export type TodayTask = Database['public']['Views']['v_today_tasks']['Row']
