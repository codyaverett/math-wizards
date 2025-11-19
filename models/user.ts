// User-related type definitions

export interface EmailSubscriber {
  id: number;
  email: string;
  name?: string;
  is_verified: boolean;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at?: string;
}

export interface UserQuestion {
  id: number;
  name?: string;
  email?: string;
  lesson_id?: number;
  question: string;
  status: "pending" | "answered" | "archived";
  admin_response?: string;
  ip_address?: string;
  created_at: string;
  answered_at?: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  sort_order: number;
  is_published: boolean;
  view_count: number;
  created_at: string;
}

export interface PageView {
  id: number;
  page_type?: string;
  page_id?: number;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  viewed_at: string;
}
