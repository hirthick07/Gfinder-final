import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { realtimeService } from '@/integrations/supabase/services';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Notification, Message } from '@/integrations/supabase/types.extended';

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = realtimeService.subscribeToNotifications(
      user.id,
      (notification: Notification) => {
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });

        // Show toast notification
        if (notification.type === 'message') {
          toast.info(notification.title, {
            description: notification.message,
          });
        }
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [user, queryClient]);
};

export const useRealtimeMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = realtimeService.subscribeToMessages(
      user.id,
      (message: Message) => {
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['messages'] });

        // Show toast notification
        toast.info('New Message', {
          description: `You have a new message: ${message.subject}`,
        });
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [user, queryClient]);
};

export const useRealtimeItemUpdates = (itemId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!itemId) return;

    const channel = realtimeService.subscribeToItemUpdates(itemId, (item) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['items', itemId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [itemId, queryClient]);
};
