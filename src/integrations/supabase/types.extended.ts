export interface UserProfile {
  id: string;
  full_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  item_id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'match' | 'item_update' | 'system';
  title: string;
  message: string;
  related_item_id?: string;
  related_message_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface ItemReport {
  id: string;
  item_id: string;
  reporter_id: string;
  reason: 'spam' | 'inappropriate' | 'fraud' | 'duplicate' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
  reviewed_at?: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_id: string;
  created_at: string;
}

export interface ItemWithUserInfo {
  id: string;
  user_id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contact_name: string;
  contact_email: string;
  image_url?: string;
  status: 'active' | 'resolved' | 'archived';
  resolved_at?: string;
  views_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  user_full_name?: string;
  user_avatar_url?: string;
}

export interface ItemStats {
  active_lost_items: number;
  active_found_items: number;
  resolved_items: number;
  total_users: number;
  total_items: number;
  items_this_week: number;
  items_this_month: number;
}

export interface UserItemStats {
  user_id: string;
  total_items: number;
  lost_items: number;
  found_items: number;
  active_items: number;
  resolved_items: number;
  total_views: number;
}

export interface PotentialMatch {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  similarity_score: number;
}
