export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      screens: {
        Row: {
          changes: string
          created_at: string | null
          html_file: string
          id: number
          name: string
          version: number
        }
        Insert: {
          changes: string
          created_at?: string | null
          html_file: string
          id?: number
          name: string
          version: number
        }
        Update: {
          changes?: string
          created_at?: string | null
          html_file?: string
          id?: number
          name?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
