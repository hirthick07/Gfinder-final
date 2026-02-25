# Backend Setup Guide for GFinder

## Overview
This document outlines all backend components and setup instructions for the GFinder lost and found application.

## Database Schema

### Tables Created

1. **user_profiles** - Extended user information
   - `id`, `full_name`, `phone`, `bio`, `avatar_url`
   - `email_notifications`, `push_notifications`
   - Auto-created when user signs up

2. **items** (Enhanced)
   - Original fields + `status`, `views_count`, `is_featured`
   - Full-text search capability with `search_vector`
   - Indexes for performance optimization

3. **messages** - User-to-user communication
   - `sender_id`, `receiver_id`, `item_id`
   - `subject`, `message`, `is_read`

4. **notifications** - System notifications
   - Types: `message`, `match`, `item_update`, `system`
   - Auto-created when messages are sent

5. **saved_items** - User bookmarks/favorites
   - Users can save items they're interested in

6. **item_reports** - Content moderation
   - Report inappropriate items
   - Reasons: `spam`, `inappropriate`, `fraud`, `duplicate`, `other`

### Database Functions

1. **mark_item_resolved(item_id)** - Mark an item as found/resolved
2. **increment_item_views(item_id)** - Track item views
3. **get_potential_matches(item_id, limit)** - Find matching lost/found items
4. **create_notification(...)** - Create new notifications

### Views

1. **item_stats** - Global statistics dashboard
2. **user_item_stats** - Per-user statistics
3. **items_with_user_info** - Items joined with user profiles

## Security (Row Level Security)

All tables have RLS enabled with appropriate policies:
- Users can only modify their own data
- Public can view active items
- Messages/notifications are private to sender/receiver

## Supabase Setup Instructions

### 1. Create Supabase Project
```bash
# Visit https://supabase.com
# Create new project
# Copy URL and anon key
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

Alternatively, run migrations manually in Supabase Dashboard:
1. Go to SQL Editor
2. Copy each migration file content
3. Execute in order (by timestamp)

### 4. Configure Storage

Create storage bucket for images:
1. Dashboard > Storage > Create new bucket
2. Name: `item-images`
3. Public: Yes
4. File size limit: 5MB

### 5. Configure Authentication

#### Email Templates
Dashboard > Authentication > Email Templates

Customize templates for:
- Confirm signup
- Magic link
- Change email
- Reset password

#### SMTP Settings (Production)
Dashboard > Project Settings > Auth > SMTP Settings

Recommended providers:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Pay as you go)

Example SendGrid setup:
```
SMTP Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
```

### 6. Enable Realtime (Optional)

Dashboard > Database > Replication

Enable replication for:
- `messages`
- `notifications`
- `items`

## Backend Services API

### User Profile Service
```typescript
import { userProfileService } from '@/integrations/supabase/services';

// Get profile
await userProfileService.getProfile(userId);

// Update profile
await userProfileService.updateProfile(userId, { full_name: 'John Doe' });
```

### Message Service
```typescript
import { messageService } from '@/integrations/supabase/services';

// Send message
await messageService.sendMessage({
  item_id: 'xxx',
  receiver_id: 'yyy',
  subject: 'About your lost item',
  message: 'I think I found it!'
});

// Get inbox
await messageService.getInbox();

// Mark as read
await messageService.markAsRead(messageId);
```

### Notification Service
```typescript
import { notificationService } from '@/integrations/supabase/services';

// Get notifications
await notificationService.getNotifications();

// Get unread count
await notificationService.getUnreadCount();

// Mark all as read
await notificationService.markAllAsRead();
```

### Item Service
```typescript
import { itemService } from '@/integrations/supabase/services';

// Mark item as resolved
await itemService.markAsResolved(itemId);

// Get potential matches
await itemService.getPotentialMatches(itemId);

// Get statistics
await itemService.getStats();

// Full-text search
await itemService.searchItems('black wallet');
```

### Saved Items Service
```typescript
import { savedItemService } from '@/integrations/supabase/services';

// Save item
await savedItemService.saveItem(itemId);

// Unsave item
await savedItemService.unsaveItem(itemId);

// Get all saved items
await savedItemService.getSavedItems();

// Check if saved
await savedItemService.isSaved(itemId);
```

### Report Service
```typescript
import { reportService } from '@/integrations/supabase/services';

// Report item
await reportService.reportItem(itemId, 'spam', 'This is spam');

// Get my reports
await reportService.getMyReports();
```

## React Hooks

All services have corresponding React hooks with automatic caching and refetching:

```typescript
import { 
  useInbox,
  useNotifications,
  useUserProfile,
  useSavedItems,
  usePotentialMatches 
} from '@/hooks/useBackendServices';

// Example usage
const { data: inbox, isLoading } = useInbox();
const { data: notifications } = useNotifications();
const { mutate: saveItem } = useSaveItem();
```

## Realtime Subscriptions

Enable real-time updates:

```typescript
import { useRealtimeNotifications, useRealtimeMessages } from '@/hooks/useRealtime';

// In your component
useRealtimeNotifications(); // Auto-updates notifications
useRealtimeMessages(); // Auto-updates messages
```

## Testing Backend

### 1. Test User Signup
```typescript
// Should auto-create user profile
const { user } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
});
```

### 2. Test Item Creation
```typescript
// Created items should have search_vector auto-populated
const { data } = await supabase.from('items').insert({...});
```

### 3. Test Messaging
```typescript
// Should auto-create notification for receiver
const { data } = await messageService.sendMessage({...});
```

### 4. Test Search
```typescript
// Full-text search
const { data } = await itemService.searchItems('wallet');
```

### 5. Test Potential Matches
```typescript
// Should return matching items with similarity scores
const { data } = await itemService.getPotentialMatches(itemId);
```

## Performance Optimization

1. **Indexes** - All foreign keys and frequently queried columns are indexed
2. **Full-text search** - Uses PostgreSQL's tsvector for fast searching
3. **Views** - Pre-computed statistics for dashboard
4. **Connection pooling** - Enabled by default in Supabase
5. **CDN** - Storage uses Supabase CDN for images

## Monitoring

### Supabase Dashboard
- Database > Logs - SQL query logs
- Database > Table Editor - View/edit data
- Storage > Logs - File upload logs
- Auth > Users - User management

### Query Performance
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY total_exec_time DESC 
LIMIT 10;
```

## Backup and Recovery

### Automated Backups
- Supabase Pro: Daily backups retained for 7 days
- Free tier: Weekly backups

### Manual Backup
```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Restore
supabase db reset
psql -f backup.sql
```

## Production Checklist

- [ ] Environment variables configured
- [ ] All migrations applied
- [ ] RLS policies tested
- [ ] Storage bucket created
- [ ] SMTP configured for emails
- [ ] Realtime enabled for relevant tables
- [ ] Backup strategy in place
- [ ] Rate limiting configured (if needed)
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Analytics configured

## Troubleshooting

### Issue: Migrations failing
**Solution**: Run migrations in order by timestamp

### Issue: RLS blocking queries
**Solution**: Check policies with `EXPLAIN` command

### Issue: Slow searches
**Solution**: Ensure search_vector index exists

### Issue: Email not sending
**Solution**: Check SMTP settings and email templates

### Issue: Realtime not working
**Solution**: Enable replication in Dashboard

## Support

- Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues
