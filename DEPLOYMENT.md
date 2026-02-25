# Deployment Guide for GFinder

This guide covers deploying the GFinder application to production.

## Prerequisites

- Supabase account (free tier is sufficient for testing)
- Deployment platform account (Vercel, Netlify, or similar)
- Git repository

---

## 1. Supabase Production Setup

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project details
4. Wait for database to provision (~2 minutes)

### Get Credentials
1. Go to Project Settings > API
2. Copy:
   - Project URL
   - `anon` `public` key

### Run Migrations

#### Option A: Using Supabase CLI (Recommended)
```powershell
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

#### Option B: Manual SQL Execution
1. Go to SQL Editor in Dashboard
2. Copy content from each migration file in `supabase/migrations/`
3. Execute in order (by filename timestamp):
   - `20260212031747_...sql` (items table)
   - `20260212032311_...sql` (storage)
   - `20260222000001_...sql` (user profiles)
   - `20260222000002_...sql` (messages)
   - `20260222000003_...sql` (item status)
   - `20260222000004_...sql` (notifications)
   - `20260222000005_...sql` (views/stats)
   - `20260222000006_...sql` (reports/favorites)

### Configure Storage
1. Go to Storage in Dashboard
2. Bucket should be auto-created: `item-images`
3. If not, create it:
   - Name: `item-images`
   - Public: ✓ Yes
   - File size limit: 5MB

### Configure Authentication

#### Email Templates
Dashboard > Authentication > Email Templates

Customize these templates:
- **Confirm Signup**: Welcome message
- **Magic Link**: Login link
- **Reset Password**: Password reset instructions

Example template:
```html
<h2>Welcome to GFinder!</h2>
<p>Click the link below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
```

#### SMTP Settings (Production)
Dashboard > Project Settings > Auth > SMTP Settings

##### Option 1: SendGrid (Recommended for Free Tier)
- Sign up at [sendgrid.com](https://sendgrid.com)
- Create API key
- Configure:
  ```
  Host: smtp.sendgrid.net
  Port: 587
  Username: apikey
  Password: YOUR_SENDGRID_API_KEY
  ```

##### Option 2: Mailgun
- Sign up at [mailgun.com](https://mailgun.com)
- Get SMTP credentials
- Configure accordingly

##### Option 3: AWS SES
- Set up SES in AWS Console
- Get SMTP credentials
- Configure accordingly

### Enable Realtime
1. Go to Database > Replication
2. Enable for tables:
   - ✓ items
   - ✓ messages
   - ✓ notifications
3. Save changes

### Security Settings
1. Go to Authentication > Settings
2. Configure:
   - ✓ Enable Email Confirmations
   - ✓ Enable Email Change Confirmations
   - Site URL: `https://your-domain.com`
   - Redirect URLs: Add your production URL

---

## 2. Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

#### Setup
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Environment Variables
In Vercel dashboard, add:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

#### Deploy
1. Click "Deploy"
2. Wait for build (~2 minutes)
3. Your app is live!

### Option B: Deploy to Netlify

#### Setup
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### Environment Variables
In Netlify dashboard > Site settings > Environment variables:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

#### Deploy
1. Click "Deploy"
2. Wait for build
3. Configure custom domain (optional)

### Option C: Deploy to Custom Server

#### Build
```powershell
npm install
npm run build
```

#### Serve
```powershell
# Using serve
npm install -g serve
serve -s dist -l 3000

# Using nginx (recommended)
# Copy dist/ to /var/www/gfinder
# Configure nginx to serve static files
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/gfinder;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

---

## 3. Custom Domain Setup

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

### Supabase Custom Domain (Optional)
1. Supabase Pro plan required
2. Go to Project Settings > Custom Domains
3. Follow instructions

---

## 4. Post-Deployment Checklist

### Security
- [ ] Environment variables are set correctly
- [ ] Supabase RLS policies are enabled
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)
- [ ] CORS is configured in Supabase (allow your domain)
- [ ] API keys are not exposed in client code

### Functionality
- [ ] User signup/login works
- [ ] Email confirmation works (check spam folder)
- [ ] Item creation works
- [ ] Image upload works
- [ ] Search works
- [ ] Messages work
- [ ] Notifications appear
- [ ] Realtime updates work

### Performance
- [ ] Enable CDN caching for images
- [ ] Enable Supabase Connection Pooling
- [ ] Monitor API response times
- [ ] Check Lighthouse scores (aim for >90)

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Enable Supabase logging
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors

---

## 5. Monitoring & Analytics

### Supabase Dashboard
Monitor:
- Database size and growth
- API requests per day
- Storage usage
- Active connections

### Performance Monitoring
Recommended tools:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics
- **Vercel Analytics** - Web vitals

### Setting up Sentry
```powershell
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 6. Scaling Considerations

### Database
- **Free Tier**: 500MB, 1GB bandwidth
- **Pro Tier**: 8GB, 50GB bandwidth
- Upgrade when approaching limits

### Storage
- **Free Tier**: 1GB
- **Pro Tier**: 100GB
- Consider S3/Cloudflare R2 for large scale

### Compute
- Static hosting (Vercel/Netlify) scales automatically
- No backend server needed

### Caching
Enable caching in production:
```typescript
// src/App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});
```

---

## 7. Backup Strategy

### Automated Backups
- **Supabase Free**: Weekly backups (7 day retention)
- **Supabase Pro**: Daily backups (7 day retention)

### Manual Backup
```powershell
# Using Supabase CLI
supabase db dump -f backup-$(Get-Date -Format 'yyyy-MM-dd').sql

# Schedule with Task Scheduler (Windows)
# Or cron (Linux)
```

### Recovery
```powershell
# Restore from backup
supabase db reset
psql -h db.xxx.supabase.co -U postgres -f backup.sql
```

---

## 8. Maintenance

### Regular Tasks
- **Weekly**: Review error logs
- **Monthly**: Check performance metrics
- **Quarterly**: Review and optimize queries
- **Annually**: Audit security and dependencies

### Updates
```powershell
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 9. Cost Optimization

### Free Tier Limits
- Database: 500MB
- Storage: 1GB
- Bandwidth: 1GB
- API requests: Unlimited

### Tips to Stay in Free Tier
1. Implement image compression before upload
2. Use CDN for static assets
3. Enable browser caching
4. Paginate large lists
5. Clean up old data periodically

### When to Upgrade to Pro ($25/month)
- Daily backups needed
- More storage/bandwidth required
- Need better support
- Custom domains required

---

## 10. Troubleshooting

### Build Errors
```powershell
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Database Connection Issues
- Check RLS policies
- Verify API keys
- Check network connectivity
- Review Supabase status page

### Email Not Sending
- Verify SMTP settings
- Check spam folder
- Test with different email provider
- Review Supabase auth logs

### Storage Issues
- Verify bucket permissions
- Check file size limits
- Ensure public access is enabled
- Test with different file types

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com

---

## Quick Deploy Commands

```powershell
# Complete deployment workflow

# 1. Setup environment
cp .env.example .env
# Edit .env with production values

# 2. Setup Supabase
supabase login
supabase link --project-ref YOUR_REF
supabase db push

# 3. Build and deploy
npm install
npm run build

# 4. Deploy to Vercel
npm i -g vercel
vercel --prod

# Or push to GitHub to trigger automatic deployment
git add .
git commit -m "Deploy to production"
git push origin main
```

---

Your GFinder application is now ready for production! 🚀
