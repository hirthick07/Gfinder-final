# GFinder System Architecture

This document provides visual representations of the GFinder system architecture.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                    (React + TypeScript)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Home   │  │  Browse  │  │  Report  │  │ Profile  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                     SERVICE LAYER                                │
│                  (TypeScript Services)                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │  Item   │ │ Message │ │  User   │ │ Notify  │ │ Saved   │ │
│  │ Service │ │ Service │ │ Service │ │ Service │ │ Service │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Supabase Client
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      SUPABASE BACKEND                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL Database                     │  │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐      │  │
│  │  │  items  │ │messages │ │ profiles │ │  saved   │      │  │
│  │  │         │ │         │ │          │ │  items   │      │  │
│  │  └─────────┘ └─────────┘ └──────────┘ └──────────┘      │  │
│  │  ┌──────────┐ ┌─────────┐                               │  │
│  │  │  notify  │ │ reports │                               │  │
│  │  │          │ │         │                               │  │
│  │  └──────────┘ └─────────┘                               │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Authentication                          │  │
│  │              (Email/Password + JWT)                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Storage (S3-like)                       │  │
│  │                  (item-images bucket)                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Realtime (WebSocket)                      │  │
│  │            (notifications, messages, items)                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema Diagram

```
┌──────────────────┐         ┌──────────────────┐
│   auth.users     │         │  user_profiles   │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │◄────────│ id (PK, FK)      │
│ email            │         │ full_name        │
│ encrypted_password│        │ phone            │
│ created_at       │         │ bio              │
└──────────────────┘         │ avatar_url       │
                             │ email_notif      │
                             │ push_notif       │
                             └──────────────────┘
        │                            
        │                            
        ▼                            
┌──────────────────┐         ┌──────────────────┐
│      items       │         │   saved_items    │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │◄────────│ item_id (FK)     │
│ user_id (FK)     │         │ user_id (FK)     │
│ type             │         │ created_at       │
│ title            │         └──────────────────┘
│ description      │                 
│ category         │         ┌──────────────────┐
│ location         │         │  item_reports    │
│ date             │         ├──────────────────┤
│ status           │◄────────│ item_id (FK)     │
│ views_count      │         │ reporter_id (FK) │
│ image_url        │         │ reason           │
│ search_vector    │         │ status           │
│ created_at       │         └──────────────────┘
└──────────────────┘                 
        │                            
        │                            
        ▼                            
┌──────────────────┐         ┌──────────────────┐
│    messages      │         │  notifications   │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │◄────────│ related_msg (FK) │
│ item_id (FK)     │         │ id (PK)          │
│ sender_id (FK)   │         │ user_id (FK)     │
│ receiver_id (FK) │         │ type             │
│ subject          │         │ title            │
│ message          │         │ message          │
│ is_read          │         │ related_item (FK)│
│ created_at       │         │ is_read          │
└──────────────────┘         │ created_at       │
                             └──────────────────┘
```

## 🔄 User Flow Diagrams

### Report Lost Item Flow
```
┌─────────┐
│  User   │
│  Login  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Click "Report   │
│  Lost Item"     │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Fill Form:      │
│ - Title         │
│ - Description   │
│ - Category      │
│ - Location      │
│ - Date          │
│ - Upload Image  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐      ┌──────────────────┐
│   Submit Form   │─────►│ Create Item in DB│
└─────────────────┘      └────┬─────────────┘
                              │
                              ▼
                         ┌──────────────────┐
                         │ Upload Image to  │
                         │    Storage       │
                         └────┬─────────────┘
                              │
                              ▼
                         ┌──────────────────┐
                         │  Run Matching    │
                         │   Algorithm      │
                         └────┬─────────────┘
                              │
                              ▼
                         ┌──────────────────┐
                         │ Show Potential   │
                         │    Matches       │
                         └──────────────────┘
```

### Messaging Flow
```
┌─────────┐
│  User A │
│ Views   │
│ Item    │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Click "Contact  │
│     Owner"      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Write Message   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐      ┌──────────────────┐
│ Send Message    │─────►│ Insert into DB   │
└─────────────────┘      └────┬─────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Trigger: Create     │
                    │    Notification     │
                    └────┬────────────────┘
                         │
                         ▼
                    ┌─────────────────────┐
                    │ Realtime: Push to   │
                    │     User B          │
                    └────┬────────────────┘
                         │
                         ▼
                    ┌─────────────────────┐
                    │   User B Gets       │
                    │   Toast Notif       │
                    └─────────────────────┘
```

## 🔐 Security Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                        │
└──────────────────────────────────────────────────────────┘

Layer 1: HTTPS/TLS Encryption
┌────────────────────────────────────────────────────────┐
│ All traffic encrypted in transit                       │
└────────────────────────────────────────────────────────┘

Layer 2: Authentication
┌────────────────────────────────────────────────────────┐
│ • Email/Password with bcrypt hashing                   │
│ • JWT tokens with expiration                           │
│ • Email verification required                          │
└────────────────────────────────────────────────────────┘

Layer 3: Row Level Security (RLS)
┌────────────────────────────────────────────────────────┐
│ items:                                                  │
│   ✓ Anyone can SELECT (public viewing)                 │
│   ✓ Users INSERT own items                             │
│   ✓ Users UPDATE/DELETE own items                      │
│                                                         │
│ messages:                                               │
│   ✓ Users SELECT own messages                          │
│   ✓ Users INSERT as sender                             │
│   ✓ Users UPDATE received messages                     │
│                                                         │
│ notifications:                                          │
│   ✓ Users SELECT own notifications                     │
│   ✓ Users UPDATE own notifications                     │
└────────────────────────────────────────────────────────┘

Layer 4: Storage Policies
┌────────────────────────────────────────────────────────┐
│ • Public read for item images                          │
│ • Authenticated users can upload                       │
│ • Users can update/delete own images                   │
│ • 5MB file size limit                                  │
└────────────────────────────────────────────────────────┘

Layer 5: Input Validation
┌────────────────────────────────────────────────────────┐
│ • Zod schema validation on frontend                    │
│ • PostgreSQL type checking                             │
│ • SQL injection prevention (parameterized queries)     │
│ • XSS prevention (React auto-escaping)                 │
└────────────────────────────────────────────────────────┘
```

## 🚀 Real-time Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  REALTIME FLOW                          │
└─────────────────────────────────────────────────────────┘

Frontend Component
     │
     │ useRealtimeNotifications()
     │
     ▼
┌─────────────────┐
│ Supabase Client │
│  Subscribe to   │
│  Channel        │
└────┬────────────┘
     │
     │ WebSocket Connection
     │
     ▼
┌─────────────────┐
│ Supabase Server │
│   Realtime      │
└────┬────────────┘
     │
     │ Listen for changes
     │
     ▼
┌─────────────────┐      ┌──────────────┐
│  PostgreSQL     │      │    Event:    │
│   Insert into   │─────►│ postgres_    │
│ notifications   │      │  changes     │
└─────────────────┘      └──────┬───────┘
                                │
                                │ Broadcast
                                │
                                ▼
                         ┌──────────────┐
                         │   Filter:    │
                         │ user_id =    │
                         │  {userId}    │
                         └──────┬───────┘
                                │
                                │ Push to client
                                │
                                ▼
                         ┌──────────────┐
                         │   Frontend   │
                         │   Callback   │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Update UI +  │
                         │ Show Toast   │
                         └──────────────┘
```

## 📱 Component Architecture

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            QueryClientProvider                   │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │          AuthProvider                       │  │  │
│  │  │  ┌──────────────────────────────────────┐  │  │  │
│  │  │  │      RealtimeProvider                │  │  │  │
│  │  │  │  ┌────────────────────────────────┐  │  │  │  │
│  │  │  │  │       BrowserRouter            │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │        Navbar            │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────┘  │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │        Routes            │  │  │  │  │  │
│  │  │  │  │  │  ┌────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │  Index (Home)      │  │  │  │  │  │  │
│  │  │  │  │  │  │  Browse            │  │  │  │  │  │  │
│  │  │  │  │  │  │  ReportItem        │  │  │  │  │  │  │
│  │  │  │  │  │  │  ItemDetail        │  │  │  │  │  │  │
│  │  │  │  │  │  │  Profile           │  │  │  │  │  │  │
│  │  │  │  │  │  │  Auth              │  │  │  │  │  │  │
│  │  │  │  │  │  │  HowItWorks        │  │  │  │  │  │  │
│  │  │  │  │  │  └────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────┘  │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │        Footer            │  │  │  │  │  │
│  │  │  │  │  └──────────────────────────┘  │  │  │  │  │
│  │  │  │  └────────────────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## 🔧 Service Layer Pattern

```
Page Component (e.g., Browse.tsx)
         │
         │ import { useInbox }
         │
         ▼
┌──────────────────────────┐
│  Custom Hook             │
│  (useBackendServices.ts) │
│                          │
│  useInbox() {            │
│    useQuery({            │
│      queryFn: ...        │
│    })                    │
│  }                       │
└────────┬─────────────────┘
         │
         │ calls
         │
         ▼
┌──────────────────────────┐
│  Service Layer           │
│  (services.ts)           │
│                          │
│  messageService.getInbox()│
│  {                        │
│    supabase              │
│      .from('messages')   │
│      .select('*')        │
│  }                       │
└────────┬─────────────────┘
         │
         │ Supabase Client
         │
         ▼
┌──────────────────────────┐
│  Supabase API            │
│  (REST/GraphQL)          │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  PostgreSQL Database     │
│  + Row Level Security    │
└──────────────────────────┘
```

## 📊 Data Flow Examples

### Creating an Item
```
User fills form
    │
    ▼
Form validation (Zod)
    │
    ▼
Upload image (if any)
    │
    ▼
Insert into items table
    │
    ▼
Trigger: Update search_vector
    │
    ▼
RPC: get_potential_matches()
    │
    ▼
Return matches to user
    │
    ▼
Update React Query cache
    │
    ▼
Navigate to item detail
```

### Search Flow
```
User types in search bar
    │
    ▼
Debounce (300ms)
    │
    ▼
Full-text search (tsvector)
+ Category filter
+ Type filter
    │
    ▼
Return results
    │
    ▼
Display in grid
```

---

This architecture supports:
- ✅ Scalability (serverless Supabase)
- ✅ Security (RLS + Auth)
- ✅ Performance (indexes, caching)
- ✅ Real-time (WebSocket)
- ✅ Maintainability (service layer)
- ✅ Testability (isolated services)
