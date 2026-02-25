import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  messageService, 
  notificationService, 
  userProfileService,
  itemService,
  savedItemService,
  reportService
} from '@/integrations/supabase/services';
import { toast } from 'sonner';

// ============== MESSAGE HOOKS ==============

export const useInbox = () => {
  return useQuery({
    queryKey: ['messages', 'inbox'],
    queryFn: async () => {
      const { data, error } = await messageService.getInbox();
      if (error) throw error;
      return data;
    }
  });
};

export const useSentMessages = () => {
  return useQuery({
    queryKey: ['messages', 'sent'],
    queryFn: async () => {
      const { data, error } = await messageService.getSent();
      if (error) throw error;
      return data;
    }
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to send message');
    }
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => messageService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });
};

// ============== NOTIFICATION HOOKS ==============

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await notificationService.getNotifications();
      if (error) throw error;
      return data;
    }
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { count, error } = await notificationService.getUnreadCount();
      if (error) throw error;
      return count;
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    }
  });
};

// ============== USER PROFILE HOOKS ==============

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const { data, error } = await userProfileService.getProfile(userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      userProfileService.updateProfile(userId, updates),
    onSuccess: (data) => {
      if (data.data) {
        queryClient.invalidateQueries({ queryKey: ['user-profile', data.data.id] });
        toast.success('Profile updated successfully!');
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update profile');
    }
  });
};

// ============== ITEM HOOKS ==============

export const useMarkItemResolved = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => itemService.markAsResolved(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item marked as resolved!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to mark item as resolved');
    }
  });
};

export const usePotentialMatches = (itemId: string) => {
  return useQuery({
    queryKey: ['potential-matches', itemId],
    queryFn: async () => {
      const { data, error } = await itemService.getPotentialMatches(itemId);
      if (error) throw error;
      return data;
    },
    enabled: !!itemId
  });
};

export const useItemStats = () => {
  return useQuery({
    queryKey: ['item-stats'],
    queryFn: async () => {
      const { data, error } = await itemService.getStats();
      if (error) throw error;
      return data;
    }
  });
};

// ============== SAVED ITEMS HOOKS ==============

export const useSavedItems = () => {
  return useQuery({
    queryKey: ['saved-items'],
    queryFn: async () => {
      const { data, error } = await savedItemService.getSavedItems();
      if (error) throw error;
      return data;
    }
  });
};

export const useIsSaved = (itemId: string) => {
  return useQuery({
    queryKey: ['is-saved', itemId],
    queryFn: async () => {
      const { saved, error } = await savedItemService.isSaved(itemId);
      if (error) throw error;
      return saved;
    },
    enabled: !!itemId
  });
};

export const useSaveItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => savedItemService.saveItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      queryClient.invalidateQueries({ queryKey: ['is-saved'] });
      toast.success('Item saved!');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to save item');
    }
  });
};

export const useUnsaveItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: string) => savedItemService.unsaveItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-items'] });
      queryClient.invalidateQueries({ queryKey: ['is-saved'] });
      toast.success('Item removed from saved');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to remove item');
    }
  });
};

// ============== REPORT HOOKS ==============

export const useReportItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, reason, description }: { 
      itemId: string; 
      reason: any; 
      description?: string;
    }) => reportService.reportItem(itemId, reason, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Item reported successfully. We will review it shortly.');
    },
    onError: (error: any) => {
      if (error?.message?.includes('duplicate')) {
        toast.error('You have already reported this item');
      } else {
        toast.error(error?.message || 'Failed to report item');
      }
    }
  });
};

export const useMyReports = () => {
  return useQuery({
    queryKey: ['reports', 'my-reports'],
    queryFn: async () => {
      const { data, error } = await reportService.getMyReports();
      if (error) throw error;
      return data;
    }
  });
};
