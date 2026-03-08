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
      ad_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          page_url: string | null
          slot_key: string
        }
        Insert: {
          created_at?: string
          event_type?: string
          id?: string
          page_url?: string | null
          slot_key: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          page_url?: string | null
          slot_key?: string
        }
        Relationships: []
      }
      ad_slots: {
        Row: {
          ad_code: string | null
          created_at: string
          display_rules: Json
          fallback_image_url: string | null
          fallback_link: string | null
          fallback_type: string | null
          id: string
          is_active: boolean
          name: string
          size_desktop: string | null
          size_mobile: string | null
          slot_key: string
          slot_type: string
          updated_at: string
        }
        Insert: {
          ad_code?: string | null
          created_at?: string
          display_rules?: Json
          fallback_image_url?: string | null
          fallback_link?: string | null
          fallback_type?: string | null
          id?: string
          is_active?: boolean
          name: string
          size_desktop?: string | null
          size_mobile?: string | null
          slot_key: string
          slot_type?: string
          updated_at?: string
        }
        Update: {
          ad_code?: string | null
          created_at?: string
          display_rules?: Json
          fallback_image_url?: string | null
          fallback_link?: string | null
          fallback_type?: string | null
          id?: string
          is_active?: boolean
          name?: string
          size_desktop?: string | null
          size_mobile?: string | null
          slot_key?: string
          slot_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          downvotes: number
          id: string
          parent_id: string | null
          updated_at: string
          upvotes: number
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          downvotes?: number
          id?: string
          parent_id?: string | null
          updated_at?: string
          upvotes?: number
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          downvotes?: number
          id?: string
          parent_id?: string | null
          updated_at?: string
          upvotes?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "article_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
          vote_type: number
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
          vote_type: number
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "article_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          asset_tags: string[]
          content: string
          created_at: string
          id: string
          likes_count: number
          market_category: Database["public"]["Enums"]["market_category"]
          replies_count: number
          sentiment: Database["public"]["Enums"]["post_sentiment"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_tags?: string[]
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          market_category?: Database["public"]["Enums"]["market_category"]
          replies_count?: number
          sentiment?: Database["public"]["Enums"]["post_sentiment"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_tags?: string[]
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          market_category?: Database["public"]["Enums"]["market_category"]
          replies_count?: number
          sentiment?: Database["public"]["Enums"]["post_sentiment"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          reason: string
          reporter_id: string
          status: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          status?: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          status?: string
        }
        Relationships: []
      }
      crossfire_stories: {
        Row: {
          breakdown: string | null
          created_at: string
          factual_summary: string | null
          id: string
          lean_center: number | null
          lean_left: number | null
          lean_right: number | null
          neutral_headline: string
        }
        Insert: {
          breakdown?: string | null
          created_at?: string
          factual_summary?: string | null
          id: string
          lean_center?: number | null
          lean_left?: number | null
          lean_right?: number | null
          neutral_headline: string
        }
        Update: {
          breakdown?: string | null
          created_at?: string
          factual_summary?: string | null
          id?: string
          lean_center?: number | null
          lean_left?: number | null
          lean_right?: number | null
          neutral_headline?: string
        }
        Relationships: []
      }
      crossfire_story_sources: {
        Row: {
          article_id: string
          excerpt: string | null
          headline: string
          id: string
          image_url: string | null
          political_bias: string
          published_at: string
          source: string
          story_id: string
          url: string
        }
        Insert: {
          article_id: string
          excerpt?: string | null
          headline: string
          id?: string
          image_url?: string | null
          political_bias: string
          published_at?: string
          source: string
          story_id: string
          url: string
        }
        Update: {
          article_id?: string
          excerpt?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          political_bias?: string
          published_at?: string
          source?: string
          story_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "crossfire_story_sources_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "crossfire_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          ai_summary: string | null
          article_type: string
          balanced_summary: string | null
          bias_center: number | null
          bias_left: number | null
          bias_right: number | null
          category: string
          center_perspective: string | null
          created_at: string
          id: string
          image_url: string | null
          left_perspective: string | null
          political_bias: string | null
          published_at: string
          related_symbols: string[] | null
          right_perspective: string | null
          source: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          ai_summary?: string | null
          article_type?: string
          balanced_summary?: string | null
          bias_center?: number | null
          bias_left?: number | null
          bias_right?: number | null
          category?: string
          center_perspective?: string | null
          created_at?: string
          id: string
          image_url?: string | null
          left_perspective?: string | null
          political_bias?: string | null
          published_at?: string
          related_symbols?: string[] | null
          right_perspective?: string | null
          source: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          ai_summary?: string | null
          article_type?: string
          balanced_summary?: string | null
          bias_center?: number | null
          bias_left?: number | null
          bias_right?: number | null
          category?: string
          center_perspective?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          left_perspective?: string | null
          political_bias?: string | null
          published_at?: string
          related_symbols?: string[] | null
          right_perspective?: string | null
          source?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          interests: Database["public"]["Enums"]["interest_category"][]
          is_active: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interests?: Database["public"]["Enums"]["interest_category"][]
          is_active?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interests?: Database["public"]["Enums"]["interest_category"][]
          is_active?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          reputation: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          reputation?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          reputation?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_articles: {
        Row: {
          ai_summary: string | null
          article_image_url: string | null
          article_source: string | null
          article_title: string
          article_url: string
          balanced_summary: string | null
          created_at: string
          id: string
          political_bias: Database["public"]["Enums"]["political_bias"] | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          article_image_url?: string | null
          article_source?: string | null
          article_title: string
          article_url: string
          balanced_summary?: string | null
          created_at?: string
          id?: string
          political_bias?: Database["public"]["Enums"]["political_bias"] | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          article_image_url?: string | null
          article_source?: string | null
          article_title?: string
          article_url?: string
          balanced_summary?: string | null
          created_at?: string
          id?: string
          political_bias?: Database["public"]["Enums"]["political_bias"] | null
          user_id?: string
        }
        Relationships: []
      }
      sponsor_banners: {
        Row: {
          created_at: string
          display_end: string | null
          display_order: number
          display_start: string | null
          id: string
          image_url: string | null
          is_active: boolean
          label: string | null
          link_url: string
          slot_key: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_end?: string | null
          display_order?: number
          display_start?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          label?: string | null
          link_url: string
          slot_key: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_end?: string | null
          display_order?: number
          display_start?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          label?: string | null
          link_url?: string
          slot_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge: Database["public"]["Enums"]["badge_type"]
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge: Database["public"]["Enums"]["badge_type"]
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge?: Database["public"]["Enums"]["badge_type"]
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          created_at: string
          id: string
          interest: Database["public"]["Enums"]["interest_category"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interest: Database["public"]["Enums"]["interest_category"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interest?: Database["public"]["Enums"]["interest_category"]
          user_id?: string
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
      badge_type:
        | "crypto_analyst"
        | "options_trader"
        | "top_contributor"
        | "stock_guru"
        | "commodity_expert"
        | "macro_strategist"
        | "first_post"
        | "popular_post"
        | "veteran"
      interest_category: "crypto" | "global_markets" | "commodities"
      market_category:
        | "crypto"
        | "stocks"
        | "options"
        | "commodities"
        | "forex"
        | "macro"
        | "general"
      political_bias: "left" | "center" | "right"
      post_sentiment: "bullish" | "bearish"
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
    Enums: {
      badge_type: [
        "crypto_analyst",
        "options_trader",
        "top_contributor",
        "stock_guru",
        "commodity_expert",
        "macro_strategist",
        "first_post",
        "popular_post",
        "veteran",
      ],
      interest_category: ["crypto", "global_markets", "commodities"],
      market_category: [
        "crypto",
        "stocks",
        "options",
        "commodities",
        "forex",
        "macro",
        "general",
      ],
      political_bias: ["left", "center", "right"],
      post_sentiment: ["bullish", "bearish"],
    },
  },
} as const
