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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ai_runs: {
        Row: {
          created_at: string
          error: Json | null
          finished_at: string | null
          id: string
          idempotency_key: string | null
          initiated_by: string | null
          input: Json
          metadata: Json
          model: string | null
          output: Json | null
          prompt_version: string | null
          provider: string | null
          started_at: string | null
          status: string
          updated_at: string
          workflow_name: string
          workflow_version: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          error?: Json | null
          finished_at?: string | null
          id?: string
          idempotency_key?: string | null
          initiated_by?: string | null
          input?: Json
          metadata?: Json
          model?: string | null
          output?: Json | null
          prompt_version?: string | null
          provider?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          workflow_name: string
          workflow_version?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          error?: Json | null
          finished_at?: string | null
          id?: string
          idempotency_key?: string | null
          initiated_by?: string | null
          input?: Json
          metadata?: Json
          model?: string | null
          output?: Json | null
          prompt_version?: string | null
          provider?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          workflow_name?: string
          workflow_version?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_runs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          metadata: Json
          request_id: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
          metadata?: Json
          request_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
          metadata?: Json
          request_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          metadata: Json
          provider: string
          provider_customer_id: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json
          provider?: string
          provider_customer_id?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json
          provider?: string
          provider_customer_id?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_customers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          brand_assets: Json
          brand_voice: Json
          business_id: string
          created_at: string
          id: string
          name: string
          positioning: string | null
          status: string
          tagline: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          brand_assets?: Json
          brand_voice?: Json
          business_id: string
          created_at?: string
          id?: string
          name: string
          positioning?: string | null
          status?: string
          tagline?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          brand_assets?: Json
          brand_voice?: Json
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          positioning?: string | null
          status?: string
          tagline?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brands_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          country_code: string
          created_at: string
          id: string
          industry: string | null
          legal_name: string | null
          metadata: Json
          name: string
          status: string
          timezone: string
          updated_at: string
          website_url: string | null
          workspace_id: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          id?: string
          industry?: string | null
          legal_name?: string | null
          metadata?: Json
          name: string
          status?: string
          timezone?: string
          updated_at?: string
          website_url?: string | null
          workspace_id: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          industry?: string | null
          legal_name?: string | null
          metadata?: Json
          name?: string
          status?: string
          timezone?: string
          updated_at?: string
          website_url?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          audience: Json
          brand_id: string | null
          budget: Json
          business_id: string
          channels: Json
          created_at: string
          id: string
          name: string
          objective: string | null
          status: string
          strategy: Json
          updated_at: string
          workspace_id: string
        }
        Insert: {
          audience?: Json
          brand_id?: string | null
          budget?: Json
          business_id: string
          channels?: Json
          created_at?: string
          id?: string
          name: string
          objective?: string | null
          status?: string
          strategy?: Json
          updated_at?: string
          workspace_id: string
        }
        Update: {
          audience?: Json
          brand_id?: string | null
          budget?: Json
          business_id?: string
          channels?: Json
          created_at?: string
          id?: string
          name?: string
          objective?: string | null
          status?: string
          strategy?: Json
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          angle: string | null
          brand_id: string | null
          business_id: string | null
          campaign_id: string | null
          caption: string | null
          claims: Json
          context_mode: string
          continuity_state: Json
          created_at: string
          cta: string | null
          hashtags: Json
          hook: string | null
          id: string
          lineage: Json
          master_prompts: Json
          objective: string | null
          product_id: string | null
          qc_status: string
          script: string | null
          storyboard: Json
          title: string
          updated_at: string
          version: number
          workspace_id: string
        }
        Insert: {
          angle?: string | null
          brand_id?: string | null
          business_id?: string | null
          campaign_id?: string | null
          caption?: string | null
          claims?: Json
          context_mode?: string
          continuity_state?: Json
          created_at?: string
          cta?: string | null
          hashtags?: Json
          hook?: string | null
          id?: string
          lineage?: Json
          master_prompts?: Json
          objective?: string | null
          product_id?: string | null
          qc_status?: string
          script?: string | null
          storyboard?: Json
          title: string
          updated_at?: string
          version?: number
          workspace_id: string
        }
        Update: {
          angle?: string | null
          brand_id?: string | null
          business_id?: string | null
          campaign_id?: string | null
          caption?: string | null
          claims?: Json
          context_mode?: string
          continuity_state?: Json
          created_at?: string
          cta?: string | null
          hashtags?: Json
          hook?: string | null
          id?: string
          lineage?: Json
          master_prompts?: Json
          objective?: string | null
          product_id?: string | null
          qc_status?: string
          script?: string | null
          storyboard?: Json
          title?: string
          updated_at?: string
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_items_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_assets: {
        Row: {
          content_item_id: string | null
          created_at: string
          id: string
          kind: string
          metadata: Json
          mime_type: string | null
          provider: string | null
          provider_asset_id: string | null
          source_url: string | null
          storage_path: string | null
          workspace_id: string
        }
        Insert: {
          content_item_id?: string | null
          created_at?: string
          id?: string
          kind: string
          metadata?: Json
          mime_type?: string | null
          provider?: string | null
          provider_asset_id?: string | null
          source_url?: string | null
          storage_path?: string | null
          workspace_id: string
        }
        Update: {
          content_item_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          metadata?: Json
          mime_type?: string | null
          provider?: string | null
          provider_asset_id?: string | null
          source_url?: string | null
          storage_path?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_assets_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_assets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      creative_jobs: {
        Row: {
          content_item_id: string | null
          created_at: string
          error: Json | null
          finished_at: string | null
          id: string
          input: Json
          job_type: string
          output: Json | null
          provider: string
          provider_job_id: string | null
          started_at: string | null
          status: string
          workspace_id: string
        }
        Insert: {
          content_item_id?: string | null
          created_at?: string
          error?: Json | null
          finished_at?: string | null
          id?: string
          input?: Json
          job_type: string
          output?: Json | null
          provider: string
          provider_job_id?: string | null
          started_at?: string | null
          status?: string
          workspace_id: string
        }
        Update: {
          content_item_id?: string | null
          created_at?: string
          error?: Json | null
          finished_at?: string | null
          id?: string
          input?: Json
          job_type?: string
          output?: Json | null
          provider?: string
          provider_job_id?: string | null
          started_at?: string | null
          status?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creative_jobs_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creative_jobs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_documents: {
        Row: {
          brand_id: string | null
          business_id: string | null
          content: string
          content_hash: string | null
          created_at: string
          id: string
          metadata: Json
          product_id: string | null
          provider: string | null
          source_title: string | null
          source_type: string
          source_url: string | null
          updated_at: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
          workspace_id: string
        }
        Insert: {
          brand_id?: string | null
          business_id?: string | null
          content?: string
          content_hash?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          product_id?: string | null
          provider?: string | null
          source_title?: string | null
          source_type?: string
          source_url?: string | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          workspace_id: string
        }
        Update: {
          brand_id?: string | null
          business_id?: string | null
          content?: string
          content_hash?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          product_id?: string | null
          provider?: string | null
          source_title?: string | null
          source_type?: string
          source_url?: string | null
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_documents_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_documents_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string
          created_at: string
          error: Json | null
          event_type: string
          id: string
          idempotency_key: string | null
          payload: Json
          provider: string | null
          provider_message_id: string | null
          recipient: string | null
          sent_at: string | null
          status: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          error?: Json | null
          event_type: string
          id?: string
          idempotency_key?: string | null
          payload?: Json
          provider?: string | null
          provider_message_id?: string | null
          recipient?: string | null
          sent_at?: string | null
          status?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          error?: Json | null
          event_type?: string
          id?: string
          idempotency_key?: string | null
          payload?: Json
          provider?: string | null
          provider_message_id?: string | null
          recipient?: string | null
          sent_at?: string | null
          status?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json
          brand_id: string | null
          business_id: string
          claims: Json
          created_at: string
          description: string | null
          id: string
          name: string
          product_url: string | null
          sku: string | null
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          attributes?: Json
          brand_id?: string | null
          business_id: string
          claims?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          product_url?: string | null
          sku?: string | null
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          attributes?: Json
          brand_id?: string | null
          business_id?: string
          claims?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          product_url?: string | null
          sku?: string | null
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json
          plan_code: string
          provider: string
          provider_subscription_id: string | null
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          plan_code?: string
          provider?: string
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          plan_code?: string
          provider?: string
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_ledger: {
        Row: {
          id: number
          metadata: Json
          metric_code: string
          occurred_at: string
          quantity: number
          reference_id: string | null
          source: string
          unit: string
          workspace_id: string
        }
        Insert: {
          id?: never
          metadata?: Json
          metric_code: string
          occurred_at?: string
          quantity?: number
          reference_id?: string | null
          source: string
          unit?: string
          workspace_id: string
        }
        Update: {
          id?: never
          metadata?: Json
          metric_code?: string
          occurred_at?: string
          quantity?: number
          reference_id?: string | null
          source?: string
          unit?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_ledger_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          created_at: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          mode: string
          name: string
          owner_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mode?: string
          name: string
          owner_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mode?: string
          name?: string
          owner_id?: string
          slug?: string
          updated_at?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
