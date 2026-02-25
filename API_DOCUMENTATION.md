# GFinder API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Profiles](#user-profiles)
3. [Items](#items)
4. [Messages](#messages)
5. [Notifications](#notifications)
6. [Saved Items](#saved-items)
7. [Reports](#reports)
8. [Statistics](#statistics)
9. [Realtime Subscriptions](#realtime-subscriptions)

---

## Authentication

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
});
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

---

## User Profiles

### Get User Profile
```typescript
GET /user_profiles?id=eq.{userId}

const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

Response:
```json
{
  "id": "uuid",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "bio": "Campus student",
  "avatar_url": "https://...",
  "email_notifications": true,
  "push_notifications": true,
  "created_at": "2026-02-22T...",
  "updated_at": "2026-02-22T..."
}
```

### Update Profile
```typescript
PATCH /user_profiles?id=eq.{userId}

const { data, error } = await supabase
  .from('user_profiles')
  .update({
    full_name: 'Jane Doe',
    phone: '+1234567890',
    bio: 'Love helping people find their items!'
  })
  .eq('id', userId)
  .select()
  .single();
```

---

## Items

### Create Item
```typescript
POST /items

const { data, error } = await supabase
  .from('items')
  .insert({
    type: 'lost',
    title: 'Black Leather Wallet',
    description: 'Lost near library...',
    category: 'Wallet / Purse',
    location: 'Main Library',
    date: '2026-02-20',
    contact_name: 'John',
    contact_email: 'john@example.com',
    image_url: 'https://...'
  })
  .select()
  .single();
```

### Get All Items
```typescript
GET /items?status=eq.active&order=created_at.desc

const { data, error } = await supabase
  .from('items')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

### Get Item by ID
```typescript
GET /items?id=eq.{itemId}

const { data, error } = await supabase
  .from('items')
  .select('*')
  .eq('id', itemId)
  .single();
```

### Update Item
```typescript
PATCH /items?id=eq.{itemId}

const { data, error } = await supabase
  .from('items')
  .update({
    title: 'Updated Title',
    description: 'Updated description'
  })
  .eq('id', itemId)
  .select()
  .single();
```

### Delete Item
```typescript
DELETE /items?id=eq.{itemId}

const { error } = await supabase
  .from('items')
  .delete()
  .eq('id', itemId);
```

### Mark Item as Resolved
```typescript
RPC mark_item_resolved

const { error } = await supabase.rpc('mark_item_resolved', {
  item_id: itemId
});
```

### Increment Views
```typescript
RPC increment_item_views

const { error } = await supabase.rpc('increment_item_views', {
  p_item_id: itemId
});
```

### Full-Text Search
```typescript
GET /items?search_vector=fts.{query}

const { data, error } = await supabase
  .from('items')
  .select('*')
  .textSearch('search_vector', 'wallet')
  .eq('status', 'active');
```

### Get Potential Matches
```typescript
RPC get_potential_matches

const { data, error } = await supabase.rpc('get_potential_matches', {
  p_item_id: itemId,
  p_limit: 10
});
```

Response:
```json
[
  {
    "id": "uuid",
    "title": "Found: Black Wallet",
    "description": "...",
    "category": "Wallet / Purse",
    "location": "Main Library",
    "date": "2026-02-21",
    "type": "found",
    "similarity_score": 100
  }
]
```

---

## Messages

### Send Message
```typescript
POST /messages

const { data, error } = await supabase
  .from('messages')
  .insert({
    item_id: 'item-uuid',
    receiver_id: 'user-uuid',
    subject: 'About your lost item',
    message: 'I think I found your wallet!'
  })
  .select()
  .single();
```

### Get Inbox
```typescript
GET /messages?receiver_id=eq.{userId}&order=created_at.desc

const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('receiver_id', userId)
  .order('created_at', { ascending: false });
```

### Get Sent Messages
```typescript
GET /messages?sender_id=eq.{userId}&order=created_at.desc

const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('sender_id', userId)
  .order('created_at', { ascending: false });
```

### Mark as Read
```typescript
PATCH /messages?id=eq.{messageId}

const { data, error } = await supabase
  .from('messages')
  .update({ is_read: true })
  .eq('id', messageId)
  .select()
  .single();
```

### Delete Message
```typescript
DELETE /messages?id=eq.{messageId}

const { error } = await supabase
  .from('messages')
  .delete()
  .eq('id', messageId);
```

---

## Notifications

### Get All Notifications
```typescript
GET /notifications?user_id=eq.{userId}&order=created_at.desc

const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Get Unread Count
```typescript
GET /notifications?user_id=eq.{userId}&is_read=eq.false (count)

const { count, error } = await supabase
  .from('notifications')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
  .eq('is_read', false);
```

### Mark as Read
```typescript
PATCH /notifications?id=eq.{notificationId}

const { error } = await supabase
  .from('notifications')
  .update({ is_read: true })
  .eq('id', notificationId);
```

### Mark All as Read
```typescript
PATCH /notifications?user_id=eq.{userId}&is_read=eq.false

const { error } = await supabase
  .from('notifications')
  .update({ is_read: true })
  .eq('user_id', userId)
  .eq('is_read', false);
```

### Create Notification (RPC)
```typescript
RPC create_notification

const { data, error } = await supabase.rpc('create_notification', {
  p_user_id: userId,
  p_type: 'system',
  p_title: 'Welcome!',
  p_message: 'Welcome to GFinder',
  p_related_item_id: null,
  p_related_message_id: null
});
```

---

## Saved Items

### Save Item
```typescript
POST /saved_items

const { data, error } = await supabase
  .from('saved_items')
  .insert({
    item_id: itemId
  })
  .select()
  .single();
```

### Get Saved Items
```typescript
GET /saved_items?user_id=eq.{userId}&select=*,items(*)

const { data, error } = await supabase
  .from('saved_items')
  .select('*, items(*)')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Remove Saved Item
```typescript
DELETE /saved_items?item_id=eq.{itemId}&user_id=eq.{userId}

const { error } = await supabase
  .from('saved_items')
  .delete()
  .eq('user_id', userId)
  .eq('item_id', itemId);
```

### Check if Item is Saved
```typescript
GET /saved_items?user_id=eq.{userId}&item_id=eq.{itemId}

const { data, error } = await supabase
  .from('saved_items')
  .select('id')
  .eq('user_id', userId)
  .eq('item_id', itemId)
  .single();
```

---

## Reports

### Report Item
```typescript
POST /item_reports

const { data, error } = await supabase
  .from('item_reports')
  .insert({
    item_id: itemId,
    reason: 'spam',
    description: 'This looks like spam content'
  })
  .select()
  .single();
```

Reasons: `spam`, `inappropriate`, `fraud`, `duplicate`, `other`

### Get My Reports
```typescript
GET /item_reports?reporter_id=eq.{userId}

const { data, error } = await supabase
  .from('item_reports')
  .select('*')
  .eq('reporter_id', userId)
  .order('created_at', { ascending: false });
```

---

## Statistics

### Get Global Stats
```typescript
GET /item_stats

const { data, error } = await supabase
  .from('item_stats')
  .select('*')
  .single();
```

Response:
```json
{
  "active_lost_items": 45,
  "active_found_items": 38,
  "resolved_items": 153,
  "total_users": 315,
  "total_items": 236,
  "items_this_week": 12,
  "items_this_month": 67
}
```

### Get User Stats
```typescript
GET /user_item_stats?user_id=eq.{userId}

const { data, error } = await supabase
  .from('user_item_stats')
  .select('*')
  .eq('user_id', userId)
  .single();
```

Response:
```json
{
  "user_id": "uuid",
  "total_items": 5,
  "lost_items": 3,
  "found_items": 2,
  "active_items": 4,
  "resolved_items": 1,
  "total_views": 127
}
```

### Get Items with User Info
```typescript
GET /items_with_user_info

const { data, error } = await supabase
  .from('items_with_user_info')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

---

## Realtime Subscriptions

### Subscribe to Notifications
```typescript
const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New notification:', payload.new);
    }
  )
  .subscribe();

// Unsubscribe
channel.unsubscribe();
```

### Subscribe to Messages
```typescript
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `receiver_id=eq.${userId}`
    },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();
```

### Subscribe to Item Updates
```typescript
const channel = supabase
  .channel(`item-${itemId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'items',
      filter: `id=eq.${itemId}`
    },
    (payload) => {
      console.log('Item updated:', payload.new);
    }
  )
  .subscribe();
```

---

## Error Handling

All API calls return an error object if something goes wrong:

```typescript
const { data, error } = await supabase.from('items').select('*');

if (error) {
  console.error('Error:', error.message);
  // Handle error
} else {
  // Use data
}
```

Common error codes:
- `PGRST116`: No rows found (404)
- `23505`: Unique constraint violation
- `42501`: Insufficient permissions (RLS)
- `23503`: Foreign key violation

---

## Rate Limiting

Supabase has built-in rate limiting:
- Free tier: 500 requests/second
- Pro tier: 2000 requests/second

For production, implement client-side debouncing for frequent operations.

---

## Best Practices

1. **Use React Query/TanStack Query** for caching and state management
2. **Implement optimistic updates** for better UX
3. **Use RLS policies** instead of client-side filtering
4. **Batch operations** when possible
5. **Use indexes** for frequently queried fields
6. **Implement pagination** for large datasets
7. **Handle errors gracefully** with user-friendly messages
8. **Use full-text search** for better search UX
9. **Subscribe to realtime** only for critical updates
10. **Test RLS policies** thoroughly before production

---

## Code Examples

### Complete Item Creation Flow
```typescript
async function createItem(formData: ItemFormData) {
  // 1. Upload image if exists
  let imageUrl = null;
  if (formData.image) {
    const { data: uploadData, error: uploadError } = 
      await supabase.storage
        .from('item-images')
        .upload(`${userId}/${Date.now()}.jpg`, formData.image);
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(uploadData.path);
    
    imageUrl = urlData.publicUrl;
  }

  // 2. Create item
  const { data: item, error: itemError } = await supabase
    .from('items')
    .insert({
      type: formData.type,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      date: formData.date,
      contact_name: formData.contactName,
      contact_email: formData.contactEmail,
      image_url: imageUrl
    })
    .select()
    .single();

  if (itemError) throw itemError;

  // 3. Get potential matches
  const { data: matches } = await supabase.rpc('get_potential_matches', {
    p_item_id: item.id,
    p_limit: 5
  });

  return { item, matches };
}
```

### Complete Messaging Flow
```typescript
async function sendItemInquiry(itemId: string, message: string) {
  // 1. Get item details
  const { data: item } = await supabase
    .from('items')
    .select('*, user_id')
    .eq('id', itemId)
    .single();

  // 2. Send message
  const { data: messageData, error } = await supabase
    .from('messages')
    .insert({
      item_id: itemId,
      receiver_id: item.user_id,
      subject: `Inquiry about: ${item.title}`,
      message: message
    })
    .select()
    .single();

  if (error) throw error;

  // 3. Notification is auto-created by trigger
  
  return messageData;
}
```

---

## Testing

### Unit Tests
```typescript
import { describe, it, expect } from 'vitest';
import { itemService } from '@/integrations/supabase/services';

describe('Item Service', () => {
  it('should get potential matches', async () => {
    const { data } = await itemService.getPotentialMatches('item-id');
    expect(data).toBeInstanceOf(Array);
  });
});
```

### Integration Tests
```typescript
// Test complete flow
it('should create item and notify potential matches', async () => {
  const item = await createItem(testData);
  const matches = await getPotentialMatches(item.id);
  expect(matches.length).toBeGreaterThan(0);
});
```

---

For more information, visit the [Supabase Documentation](https://supabase.com/docs)
