import type { Json } from "./json";

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: { id: string; owner_id: string; slug: string; name: string; mode: string; created_at: string; updated_at: string };
        Insert: { id?: string; owner_id: string; slug: string; name: string; mode?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Insert"]>;
        Relationships: [];
      };
      workspace_members: {
        Row: { workspace_id: string; user_id: string; role: string; created_at: string };
        Insert: { workspace_id: string; user_id: string; role?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Insert"]>;
        Relationships: [];
      };
      businesses: {
        Row: { id: string; workspace_id: string; name: string; legal_name: string | null; website_url: string | null; industry: string | null; timezone: string; country_code: string; status: string; metadata: Json; created_at: string; updated_at: string };
        Insert: { id?: string; workspace_id: string; name: string; legal_name?: string | null; website_url?: string | null; industry?: string | null; timezone?: string; country_code?: string; status?: string; metadata?: Json; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
        Relationships: [];
      };
      brands: {
        Row: { id: string; workspace_id: string; business_id: string; name: string; tagline: string | null; positioning: string | null; brand_voice: Json; brand_assets: Json; status: string; created_at: string; updated_at: string };
        Insert: { id?: string; workspace_id: string; business_id: string; name: string; tagline?: string | null; positioning?: string | null; brand_voice?: Json; brand_assets?: Json; status?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: { id: string; workspace_id: string; business_id: string; brand_id: string | null; name: string; sku: string | null; description: string | null; product_url: string | null; claims: Json; attributes: Json; status: string; created_at: string; updated_at: string };
        Insert: { id?: string; workspace_id: string; business_id: string; brand_id?: string | null; name: string; sku?: string | null; description?: string | null; product_url?: string | null; claims?: Json; attributes?: Json; status?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      ai_runs: {
        Row: { id: string; workspace_id: string; initiated_by: string | null; workflow_name: string; workflow_version: string; status: string; idempotency_key: string | null; input: Json; output: Json | null; error: Json | null; provider: string | null; model: string | null; prompt_version: string | null; metadata: Json; started_at: string | null; finished_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; workspace_id: string; initiated_by?: string | null; workflow_name: string; workflow_version?: string; status?: string; idempotency_key?: string | null; input?: Json; output?: Json | null; error?: Json | null; provider?: string | null; model?: string | null; prompt_version?: string | null; metadata?: Json; started_at?: string | null; finished_at?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["ai_runs"]["Insert"]>;
        Relationships: [];
      };
      audit_events: {
        Row: { id: number; workspace_id: string | null; actor_user_id: string | null; action: string; entity_type: string; entity_id: string | null; request_id: string | null; metadata: Json; created_at: string };
        Insert: { id?: never; workspace_id?: string | null; actor_user_id?: string | null; action: string; entity_type: string; entity_id?: string | null; request_id?: string | null; metadata?: Json; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["audit_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};