# GFinder - Lost & Found Platform for Campus

A comprehensive digital lost & found application for campus communities (60,000+ students & staff). Report lost items, search found items, and reunite belongings with their rightful owners.

## 🌟 Features

### Core Functionality
- 🔐 **User Authentication** - Secure signup/login with email verification
- 📝 **Report Items** - Report lost or found items with detailed information
- 🔍 **Smart Search** - Full-text search with filters (type, category, location)
- 💬 **Messaging System** - Contact item owners directly through the platform
- 🔔 **Real-time Notifications** - Get notified of new messages and matches
- ⭐ **Save Items** - Bookmark items you're interested in
- 🤝 **Potential Matches** - AI-powered matching algorithm for lost/found pairs
- 📊 **Statistics Dashboard** - Track items, views, and success rates
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🖼️ **Image Upload** - Attach photos to item reports (up to 5MB)

### Advanced Features
- **User Profiles** - Manage personal information and preferences
- **Item Status Tracking** - Mark items as active/resolved/archived
- **View Counter** - Track how many times items are viewed
- **Report System** - Flag inappropriate content
- **Email Notifications** - Configurable email alerts
- **Realtime Updates** - Live updates for messages and notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library (Radix UI primitives)
- **Framer Motion** - Animations
- **React Router v6** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage (images)
  - Real-time subscriptions
  - Row Level Security (RLS)

### Development
- **Vitest** - Unit testing
- **ESLint** - Code linting
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js 18+ (with npm)
- Git
- Supabase account (free tier works)

### Quick Start

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd found-it-main

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run backend setup
.\setup-backend.ps1

# 5. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🗄️ Database Setup

### Automated Setup (Recommended)

Run the setup script:
```powershell
.\setup-backend.ps1
```

### Manual Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env`
3. Run migrations in order from `supabase/migrations/`
4. Create storage bucket `item-images` (public)
5. Configure authentication settings

See [BACKEND_SETUP.md](BACKEND_SETUP.md) for detailed instructions.

## 📚 Documentation

- **[BACKEND_SETUP.md](BACKEND_SETUP.md)** - Complete backend setup guide
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API reference and examples
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## 🏗️ Project Structure

```
found-it-main/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ItemCard.tsx
│   ├── pages/            # Route pages
│   │   ├── Index.tsx     # Homepage
│   │   ├── Browse.tsx    # Search items
│   │   ├── ReportItem.tsx
│   │   ├── ItemDetail.tsx
│   │   ├── Profile.tsx
│   │   └── Auth.tsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useBackendServices.ts
│   │   └── useRealtime.ts
│   ├── integrations/     # Backend integrations
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── types.ts
│   │       ├── types.extended.ts
│   │       └── services.ts
│   └── lib/              # Utilities
├── supabase/
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── package.json
```

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run build:dev       # Build in development mode
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### Database Schema

**Tables:**
- `user_profiles` - Extended user information
- `items` - Lost and found items
- `messages` - User-to-user messages
- `notifications` - System notifications
- `saved_items` - User bookmarks
- `item_reports` - Content reports

**Views:**
- `item_stats` - Global statistics
- `user_item_stats` - Per-user statistics
- `items_with_user_info` - Items with user data

**Functions:**
- `mark_item_resolved()` - Mark item as resolved
- `increment_item_views()` - Track views
- `get_potential_matches()` - Find matching items
- `create_notification()` - Create notifications

## 🎯 Usage Examples

### Report a Lost Item
1. Click "Report Lost Item"
2. Fill in details (title, description, category, location, date)
3. Upload photo (optional)
4. Submit - potential matches shown automatically

### Search for Items
1. Go to "Missing" page
2. Use search bar or filters (type/category)
3. Click item for details
4. Contact owner via messaging

### Manage Your Items
1. Go to "Profile"
2. View all your reported items
3. Edit or delete items
4. Mark as resolved when found

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- **Authentication** required for item creation
- **Email verification** for new accounts
- **HTTPS** enforced in production
- **Storage policies** protect user data
- **Input validation** with Zod schemas

## 📊 Features Breakdown

### Item Categories
- Electronics
- Wallet / Purse
- Keys
- Documents / ID
- Clothing
- Jewelry
- Bags / Backpacks
- Pets
- Other

### Notification Types
- New messages
- Potential matches found
- Item status updates
- System announcements

### Report Reasons
- Spam
- Inappropriate content
- Fraud
- Duplicate listing
- Other

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test ItemCard.test.tsx
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

### Deploy to Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Configure build settings
4. Add environment variables
5. Deploy

## 🤝 Contributing

This project was created as a mini project for educational purposes.

### Development Workflow

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📝 License

This project is available for educational purposes.

## 🙏 Acknowledgments

- Built with [Lovable.dev](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Supabase](https://supabase.com)
- Icons from [Lucide](https://lucide.dev)

## 📞 Support

For issues and questions:
- Check [BACKEND_SETUP.md](BACKEND_SETUP.md) for setup help
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API usage
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues

## 🎓 Mini Project Notes

This is a comprehensive mini project demonstrating:
- Full-stack development with React + Supabase
- Real-time features and notifications
- User authentication and authorization
- CRUD operations with relationships
- Image upload and storage
- Search and filtering
- Responsive design
- Production-ready deployment

Perfect for learning modern web development practices!

---

**Made with ❤️ for campus communities**
