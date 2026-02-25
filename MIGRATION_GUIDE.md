# Migration Execution Guide

## ✅ Configuration Status

- **Project URL**: https://jjckixmfyfzozablrcfd.supabase.co
- **Project ID**: jjckixmfyfzozablrcfd
- **Environment**: Configured in `.env` file

## 📝 Migration Execution Steps

### Quick Steps:
1. SQL Editor is opening in your browser
2. Open each migration file in VS Code (in order below)
3. Copy entire file content (Ctrl+A → Ctrl+C)
4. Paste into Supabase SQL Editor (Ctrl+V)
5. Click "Run" or press Ctrl+Enter
6. Wait for "Success" message
7. Move to next file

### Migration Files (Execute in this order):

```
📁 supabase/migrations/

1️⃣  20260212031747_68987a42-1a05-4115-b3a0-70417f90dea6.sql
    Creates: items table, RLS policies, triggers

2️⃣  20260212032311_87f6cba8-f28f-48c3-b743-94ef0c417405.sql
    Creates: item-images storage bucket, storage policies

3️⃣  20260222000001_create_user_profiles.sql
    Creates: user_profiles table, auto-creation trigger

4️⃣  20260222000002_create_messages_system.sql
    Creates: messages table, messaging policies

5️⃣  20260222000003_add_item_status_and_features.sql
    Adds: status, views, search, indexes to items

6️⃣  20260222000004_create_notifications_system.sql
    Creates: notifications table, auto-notification triggers

7️⃣  20260222000005_create_views_and_stats.sql
    Creates: statistics views, matching algorithm

8️⃣  20260222000006_create_reports_and_favorites.sql
    Creates: reports and saved_items tables
```

## 🔍 Verification Checklist

After running all migrations, verify in Supabase Dashboard:

### Tables (Database → Tables)
- [ ] items
- [ ] user_profiles
- [ ] messages
- [ ] notifications
- [ ] saved_items
- [ ] item_reports

### Storage (Storage → Buckets)
- [ ] item-images (public bucket)

### Functions (Database → Functions)
- [ ] mark_item_resolved
- [ ] increment_item_views
- [ ] get_potential_matches
- [ ] create_notification
- [ ] update_updated_at_column
- [ ] handle_new_user

### Views (Database → Views)
- [ ] item_stats
- [ ] user_item_stats
- [ ] items_with_user_info

## 🚀 Next Steps

Once all migrations are successful:

```powershell
# Start the development server
npm run dev
```

Visit: http://localhost:5173

## 🆘 Troubleshooting

### Error: "relation already exists"
- **Solution**: Table already created. Skip this migration or drop table first.

### Error: "column already exists"  
- **Solution**: Column was added. Skip or ALTER table to drop column first.

### Error: "permission denied"
- **Solution**: Make sure you're logged into Supabase and using the correct project.

### Error: "syntax error"
- **Solution**: Make sure you copied the ENTIRE migration file content.

## 📚 Documentation Reference

- **BACKEND_SETUP.md** - Detailed backend documentation
- **API_DOCUMENTATION.md** - API usage and examples
- **QUICK_START.md** - 20-minute setup guide
- **DEPLOYMENT.md** - Production deployment guide

## 🔗 Useful Links

- **SQL Editor**: https://jjckixmfyfzozablrcfd.supabase.co/project/jjckixmfyfzozablrcfd/sql
- **Database Tables**: https://jjckixmfyfzozablrcfd.supabase.co/project/jjckixmfyfzozablrcfd/editor
- **Storage**: https://jjckixmfyfzozablrcfd.supabase.co/project/jjckixmfyfzozablrcfd/storage/buckets
- **Dashboard**: https://jjckixmfyfzozablrcfd.supabase.co/project/jjckixmfyfzozablrcfd

---

**Need help?** Check BACKEND_SETUP.md or QUICK_START.md for detailed instructions.
