export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          phone: string | null;
          updated_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          phone?: string | null;
          updated_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string;
          status: 'sent' | 'received' | 'read';
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at?: string;
          status?: 'sent' | 'received' | 'read';
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          created_at?: string;
          status?: 'sent' | 'received' | 'read';
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          contact_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_id?: string;
          created_at?: string;
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
      [_ in never]: never;
    };
  };
}; 