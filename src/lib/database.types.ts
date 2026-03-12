export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'OPERATOR' | 'AUDITOR';
export type CertificationStatus = 'active' | 'expired' | 'pending';
export type SessionStatus = 'completed' | 'in-progress' | 'flagged' | 'paused';
export type CCPStatus = 'pass' | 'fail' | 'pending';
export type SensorType = 'chiller' | 'sterilizer' | 'ambient' | 'blast_freezer';
export type AlertType = 'temp_deviation' | 'missing_ccp' | 'low_yield' | 'scale_sync' | 'zone_warning';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          cipc: string;
          province: string;
          gps_lat: number;
          gps_lng: number;
          address: string | null;
          certification_status: CertificationStatus;
          total_sessions: number;
          avg_dressing_pct: number;
          blacklisted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          cipc: string;
          province: string;
          gps_lat: number;
          gps_lng: number;
          address?: string | null;
          certification_status?: CertificationStatus;
          total_sessions?: number;
          avg_dressing_pct?: number;
          blacklisted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          cipc?: string;
          province?: string;
          gps_lat?: number;
          gps_lng?: number;
          address?: string | null;
          certification_status?: CertificationStatus;
          total_sessions?: number;
          avg_dressing_pct?: number;
          blacklisted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          date: string;
          operator_id: string;
          supplier_id: string;
          animal_count: number;
          status: SessionStatus;
          species: string;
          total_live_weight: number;
          total_cdm: number;
          dressing_pct: number;
          haccp_score: number;
          step: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          date: string;
          operator_id: string;
          supplier_id: string;
          animal_count?: number;
          status?: SessionStatus;
          species?: string;
          total_live_weight?: number;
          total_cdm?: number;
          dressing_pct?: number;
          haccp_score?: number;
          step?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          operator_id?: string;
          supplier_id?: string;
          animal_count?: number;
          status?: SessionStatus;
          species?: string;
          total_live_weight?: number;
          total_cdm?: number;
          dressing_pct?: number;
          haccp_score?: number;
          step?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      intake_records: {
        Row: {
          id: string;
          session_id: string | null;
          farmer_id: string | null;
          cipc_number: string;
          species: string;
          animal_count: number;
          ear_tag_ids: string | null;
          vaccination_history: string | null;
          gps_lat: number | null;
          gps_lng: number | null;
          fmd_zone_status: 'clear' | 'restricted' | 'monitoring' | null;
          section8_doc_url: string | null;
          ante_mortem_photos: string[] | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          farmer_id?: string | null;
          cipc_number: string;
          species?: string;
          animal_count: number;
          ear_tag_ids?: string | null;
          vaccination_history?: string | null;
          gps_lat?: number | null;
          gps_lng?: number | null;
          fmd_zone_status?: 'clear' | 'restricted' | 'monitoring' | null;
          section8_doc_url?: string | null;
          ante_mortem_photos?: string[] | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          farmer_id?: string | null;
          cipc_number?: string;
          species?: string;
          animal_count?: number;
          ear_tag_ids?: string | null;
          vaccination_history?: string | null;
          gps_lat?: number | null;
          gps_lng?: number | null;
          fmd_zone_status?: 'clear' | 'restricted' | 'monitoring' | null;
          section8_doc_url?: string | null;
          ante_mortem_photos?: string[] | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      ccp_records: {
        Row: {
          id: string;
          session_id: string | null;
          ccp_name: string;
          required_value: string;
          recorded_value: string | null;
          status: CCPStatus;
          timestamp: string | null;
          corrective_action: string | null;
          recorded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          ccp_name: string;
          required_value: string;
          recorded_value?: string | null;
          status?: CCPStatus;
          timestamp?: string | null;
          corrective_action?: string | null;
          recorded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          ccp_name?: string;
          required_value?: string;
          recorded_value?: string | null;
          status?: CCPStatus;
          timestamp?: string | null;
          corrective_action?: string | null;
          recorded_by?: string | null;
          created_at?: string;
        };
      };
      sensors: {
        Row: {
          id: string;
          name: string;
          location: string;
          type: SensorType;
          min_threshold: number;
          max_threshold: number;
          current_temp: number;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          type: SensorType;
          min_threshold: number;
          max_threshold: number;
          current_temp: number;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          type?: SensorType;
          min_threshold?: number;
          max_threshold?: number;
          current_temp?: number;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sensor_readings: {
        Row: {
          id: string;
          sensor_id: string;
          temperature: number;
          in_range: boolean;
          timestamp: string;
        };
        Insert: {
          id?: string;
          sensor_id: string;
          temperature: number;
          in_range: boolean;
          timestamp?: string;
        };
        Update: {
          id?: string;
          sensor_id?: string;
          temperature?: number;
          in_range?: boolean;
          timestamp?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          type: AlertType;
          severity: AlertSeverity;
          message: string;
          timestamp: string;
          resolved: boolean;
          resolved_by: string | null;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          type: AlertType;
          severity: AlertSeverity;
          message: string;
          timestamp?: string;
          resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          type?: AlertType;
          severity?: AlertSeverity;
          message?: string;
          timestamp?: string;
          resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
        };
      };
      by_products: {
        Row: {
          id: string;
          session_id: string | null;
          product_label: string;
          count: number;
          weight_kg: number;
          price_per_unit: number | null;
          revenue: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          product_label: string;
          count: number;
          weight_kg: number;
          price_per_unit?: number | null;
          revenue?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          product_label?: string;
          count?: number;
          weight_kg?: number;
          price_per_unit?: number | null;
          revenue?: number | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          table_name: string;
          record_id: string;
          action: string;
          old_data: Json | null;
          new_data: Json | null;
          user_id: string | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          table_name: string;
          record_id: string;
          action: string;
          old_data?: Json | null;
          new_data?: Json | null;
          user_id?: string | null;
          timestamp?: string;
        };
        Update: {
          id?: string;
          table_name?: string;
          record_id?: string;
          action?: string;
          old_data?: Json | null;
          new_data?: Json | null;
          user_id?: string | null;
          timestamp?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      certification_status: CertificationStatus;
      session_status: SessionStatus;
      ccp_status: CCPStatus;
      sensor_type: SensorType;
      alert_type: AlertType;
      alert_severity: AlertSeverity;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
