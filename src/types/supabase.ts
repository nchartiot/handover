export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          comment: string;
          created_at: string;
          id: string;
          screen_id: string;
          user_id: string;
        };
        Insert: {
          comment: string;
          created_at?: string;
          id?: string;
          screen_id: string;
          user_id: string;
        };
        Update: {
          comment?: string;
          created_at?: string;
          id?: string;
          screen_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comments_screen_id_fkey';
            columns: ['screen_id'];
            referencedRelation: 'screens';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_screen_id_fkey';
            columns: ['screen_id'];
            referencedRelation: 'latest_screens';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comments_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      screens: {
        Row: {
          changes: string;
          created_at: string;
          html_file: string;
          id: string;
          is_svg: boolean;
          name: string;
          version: number;
        };
        Insert: {
          changes: string;
          created_at?: string;
          html_file: string;
          id?: string;
          is_svg: boolean;
          name: string;
          version: number;
        };
        Update: {
          changes?: string;
          created_at?: string;
          html_file?: string;
          id?: string;
          is_svg?: boolean;
          name?: string;
          version?: number;
        };
        Relationships: [];
      };
      users: {
        Row: {
          email: string;
          id: string;
        };
        Insert: {
          email: string;
          id: string;
        };
        Update: {
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      latest_screen_versions: {
        Row: {
          latest_version: number | null;
          name: string | null;
        };
        Relationships: [];
      };
      latest_screens: {
        Row: {
          changes: string | null;
          created_at: string | null;
          html_file: string | null;
          id: string | null;
          is_svg: boolean | null;
          name: string | null;
          version: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
