import { supabase } from './client';
import type { Message, Notification, UserProfile, SavedItem, ItemReport, PotentialMatch } from './types.extended';

// ============== USER PROFILE SERVICES ==============

export const userProfileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data: data as UserProfile | null, error };
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data: data as UserProfile | null, error };
  },

  async createProfile(profile: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    return { data: data as UserProfile | null, error };
  }
};

// ============== MESSAGE SERVICES ==============

export const messageService = {
  async sendMessage(message: {
    item_id: string;
    receiver_id: string;
    subject: string;
    message: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...message,
        sender_id: user.id
      })
      .select()
      .single();
    
    return { data: data as Message | null, error };
  },

  async getInbox() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });
    
    return { data: data as Message[] | null, error };
  },

  async getSent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });
    
    return { data: data as Message[] | null, error };
  },

  async markAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single();
    
    return { data: data as Message | null, error };
  },

  async deleteMessage(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
    
    return { error };
  }
};

// ============== NOTIFICATION SERVICES ==============

export const notificationService = {
  async getNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    
    return { data: data as Notification[] | null, error };
  },

  async getUnreadCount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    return { count: count || 0, error };
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    return { error };
  },

  async markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    return { error };
  },

  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    
    return { error };
  }
};

// ============== ITEM SERVICES ==============

export const itemService = {
  async markAsResolved(itemId: string) {
    const { error } = await supabase.rpc('mark_item_resolved', {
      item_id: itemId
    });
    
    return { error };
  },

  async incrementViews(itemId: string) {
    const { error } = await supabase.rpc('increment_item_views', {
      p_item_id: itemId
    });
    
    return { error };
  },

  async getPotentialMatches(itemId: string, limit: number = 10) {
    const { data, error } = await supabase.rpc('get_potential_matches', {
      p_item_id: itemId,
      p_limit: limit
    });
    
    return { data: data as PotentialMatch[] | null, error };
  },

  async getStats() {
    const { data, error } = await supabase
      .from('item_stats')
      .select('*')
      .single();
    
    return { data, error };
  },

  async searchItems(query: string) {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .textSearch('search_vector', query)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    return { data, error };
  }
};

// ============== SAVED ITEMS SERVICES ==============

export const savedItemService = {
  async saveItem(itemId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('saved_items')
      .insert({
        user_id: user.id,
        item_id: itemId
      })
      .select()
      .single();
    
    return { data: data as SavedItem | null, error };
  },

  async unsaveItem(itemId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', itemId);
    
    return { error };
  },

  async getSavedItems() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('saved_items')
      .select('*, items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async isSaved(itemId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { saved: false, error: null };

    const { data, error } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_id', itemId)
      .single();
    
    return { saved: !!data, error };
  }
};

// ============== REPORT SERVICES ==============

export const reportService = {
  async reportItem(itemId: string, reason: ItemReport['reason'], description?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('item_reports')
      .insert({
        item_id: itemId,
        reporter_id: user.id,
        reason,
        description
      })
      .select()
      .single();
    
    return { data: data as ItemReport | null, error };
  },

  async getMyReports() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('item_reports')
      .select('*')
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false });
    
    return { data: data as ItemReport[] | null, error };
  }
};

// ============== REALTIME SUBSCRIPTIONS ==============

export const realtimeService = {
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload.new as Notification)
      )
      .subscribe();
  },

  subscribeToMessages(userId: string, callback: (message: Message) => void) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => callback(payload.new as Message)
      )
      .subscribe();
  },

  subscribeToItemUpdates(itemId: string, callback: (item: any) => void) {
    return supabase
      .channel(`item-${itemId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'items',
          filter: `id=eq.${itemId}`
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  }
};
