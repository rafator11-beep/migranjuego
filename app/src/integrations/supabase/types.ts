export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      feedback_messages: {
        Row: {
          category: string
          created_at: string
          game_mode: string | null
          id: string
          message_text: string
          sender_name: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          game_mode?: string | null
          id?: string
          message_text: string
          sender_name?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          game_mode?: string | null
          id?: string
          message_text?: string
          sender_name?: string | null
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          current_round: number
          current_turn: number
          id: string
          mode: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_round?: number
          current_turn?: number
          id?: string
          mode: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_round?: number
          current_turn?: number
          id?: string
          mode?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_rankings: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          culture_games: number
          culture_score: number
          culture_wins: number
          football_games: number
          football_score: number
          football_wins: number
          games_played: number
          games_won: number
          id: string
          player_name: string
          total_score: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          culture_games?: number
          culture_score?: number
          culture_wins?: number
          football_games?: number
          football_score?: number
          football_wins?: number
          games_played?: number
          games_won?: number
          id?: string
          player_name: string
          total_score?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          culture_games?: number
          culture_score?: number
          culture_wins?: number
          football_games?: number
          football_score?: number
          football_wins?: number
          games_played?: number
          games_won?: number
          id?: string
          player_name?: string
          total_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          avatar_url: string | null
          created_at: string
          game_id: string
          has_played_this_round: boolean
          id: string
          name: string
          score: number
          team_id: string | null
          turn_order: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          game_id: string
          has_played_this_round?: boolean
          id?: string
          name: string
          score?: number
          team_id?: string | null
          turn_order?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          game_id?: string
          has_played_this_round?: boolean
          id?: string
          name?: string
          score?: number
          team_id?: string | null
          turn_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      question_votes: {
        Row: {
          created_at: string
          game_id: string | null
          id: string
          question_category: string
          question_text: string
          vote_positive: boolean
          voter_name: string | null
        }
        Insert: {
          created_at?: string
          game_id?: string | null
          id?: string
          question_category?: string
          question_text: string
          vote_positive: boolean
          voter_name?: string | null
        }
        Update: {
          created_at?: string
          game_id?: string | null
          id?: string
          question_category?: string
          question_text?: string
          vote_positive?: boolean
          voter_name?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string
          correct_answer: string | null
          created_at: string
          difficulty: number
          id: string
          mode: string
          options: Json | null
          question: string
          type: string
        }
        Insert: {
          category: string
          correct_answer?: string | null
          created_at?: string
          difficulty?: number
          id?: string
          mode: string
          options?: Json | null
          question: string
          type: string
        }
        Update: {
          category?: string
          correct_answer?: string | null
          created_at?: string
          difficulty?: number
          id?: string
          mode?: string
          options?: Json | null
          question?: string
          type?: string
        }
        Relationships: []
      }
      round_history: {
        Row: {
          created_at: string
          game_id: string
          id: string
          round_number: number
          summary: Json | null
          winner_player_id: string | null
          winner_team_id: string | null
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          round_number: number
          summary?: Json | null
          winner_player_id?: string | null
          winner_team_id?: string | null
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          round_number?: number
          summary?: Json | null
          winner_player_id?: string | null
          winner_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "round_history_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_history_winner_player_id_fkey"
            columns: ["winner_player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_history_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          category: string
          created_at: string
          id: string
          submitted_by: string | null
          suggestion_text: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          submitted_by?: string | null
          suggestion_text: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          submitted_by?: string | null
          suggestion_text?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          color: string
          created_at: string
          game_id: string
          id: string
          name: string
          score: number
        }
        Insert: {
          color?: string
          created_at?: string
          game_id: string
          id?: string
          name: string
          score?: number
        }
        Update: {
          color?: string
          created_at?: string
          game_id?: string
          id?: string
          name?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "teams_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      tictactoe_state: {
        Row: {
          board: Json
          created_at: string
          current_player_index: number
          game_id: string
          id: string
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          board?: Json
          created_at?: string
          current_player_index?: number
          game_id: string
          id?: string
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          board?: Json
          created_at?: string
          current_player_index?: number
          game_id?: string
          id?: string
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tictactoe_state_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: true
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tictactoe_state_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      used_questions: {
        Row: {
          answered_by: string | null
          created_at: string
          game_id: string
          id: string
          question_id: string
          round_number: number
          was_correct: boolean | null
        }
        Insert: {
          answered_by?: string | null
          created_at?: string
          game_id: string
          id?: string
          question_id: string
          round_number: number
          was_correct?: boolean | null
        }
        Update: {
          answered_by?: string | null
          created_at?: string
          game_id?: string
          id?: string
          question_id?: string
          round_number?: number
          was_correct?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "used_questions_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "used_questions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "used_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
