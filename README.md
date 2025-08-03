# Tier-Based Event Showcase

A web application that displays events based on user membership tiers. Built for the PsypherAI technical challenge using Next.js 14, Clerk.dev, and Supabase.

## Features

- **User Authentication**: Login and signup using Clerk.dev
- **Tier-Based Access**: Users can only see events for their membership level and below
- **Event Management**: Display events with filtering based on user tiers
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean interface with Tailwind CSS styling
- **Database Security**: Row-level security policies in Supabase
- **Loading States**: Skeleton screens while data loads
- **Tier Upgrades**: Demo functionality to change user tiers

## Getting Started

### What You'll Need
- Node.js 18 or higher
- A Supabase account and project
- A Clerk.dev account and application

### Installation

```bash
git clone <your-repo-url>
cd PsypherAi_Task
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Then add your credentials:

```env
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Get these from your Clerk dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# These can stay as-is
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/events
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/events
```

### Database Setup

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Copy everything from `database-setup.sql` and paste it in
4. Click "Run"

This will create the tables, add sample events, and set up security policies.

### Clerk Configuration

In your Clerk dashboard:

1. Go to "User & Authentication" → "Metadata"
2. Add a public metadata field called `tier` (string type)
3. Set the default value to `"free"`
4. Update your redirect URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/events`
   - After sign-up: `/events`

### Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing User Tiers

There are two ways to test different membership tiers:

### Option 1: Through Clerk Dashboard
1. Sign up for an account in the app
2. Go to your Clerk dashboard → Users → find your user
3. Edit the "Public metadata" and change `tier` to `silver`, `gold`, or `platinum`
4. Refresh the app to see the changes

### Option 2: Use the Tier Upgrade Button
1. Log into the app and go to the events page
2. Use the "Upgrade Tier" buttons to simulate tier changes
3. The changes happen immediately

### What Each Tier Can See:
- **Free**: 2 free events
- **Silver**: 4 events (free + silver)
- **Gold**: 6 events (free + silver + gold)
- **Platinum**: 6 events (same as gold for now)

## Project Structure

```
PsypherAi_Task/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout with Clerk provider
│   │   ├── page.tsx                 # Home page with tier showcase
│   │   ├── events/
│   │   │   └── page.tsx             # Events page with Suspense wrapper
│   │   ├── sign-in/[[...sign-in]]/  # Clerk sign-in pages
│   │   ├── sign-up/[[...sign-up]]/  # Clerk sign-up pages
│   │   └── api/                     # API routes
│   │       ├── events/              # Events API endpoint
│   │       ├── sync-user/           # Clerk → Supabase user sync
│   │       └── update-tier/         # Tier upgrade simulation
│   ├── components/                   # Reusable UI components
│   │   ├── EventCard.tsx            # Event display card with tier logic
│   │   ├── EventsContent.tsx        # Main events page content (async)
│   │   ├── EventsPageSkeleton.tsx   # Loading skeleton with animations
│   │   ├── TierUpgrade.tsx          # Tier upgrade interface
│   │   ├── UserSync.tsx             # Client-side user synchronization
│   │   ├── ErrorMessage.tsx         # Error display component
│   │   └── LoadingSpinner.tsx       # Generic loading spinner
│   ├── lib/                         # Utility libraries
│   │   ├── supabase.ts             # Supabase client configuration
│   │   ├── supabaseAdmin.ts        # Admin client for server operations
│   │   └── database.ts             # Database helpers with retry logic
│   ├── hooks/                       # Custom React hooks
│   └── middleware.ts                # Clerk authentication middleware
├── database-setup.sql               # Complete database setup script
├── .env.example                     # Environment variables template
└── README.md                        # This file
```

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Clerk.dev** for authentication
- **Supabase** for database (PostgreSQL)
- **Row-Level Security** for data protection

## 🔒 Security Implementation

### **Authentication Security**
- Server-side session validation with Clerk
- Protected API routes with authentication checks
- Secure user metadata storage and retrieval

### **Database Security**
- Row-Level Security (RLS) policies on all tables
- Service role isolation for admin operations
- Parameterized queries preventing SQL injection

### **Application Security**
- Environment variable isolation
- HTTPS-only cookie settings
- CORS configuration for API endpoints

## 🚀 Deployment Guide

### **Vercel Deployment (Recommended)**

1. **Prepare Repository:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Import the project
   - Add all environment variables from `.env.local`
   - Deploy

3. **Update Clerk URLs:**
   - Update redirect URLs in Clerk dashboard to your production domain
   - Ensure CORS settings in Supabase allow your production domain

### **Environment Variables for Production:**
- Copy all variables from `.env.local`
- Update Clerk redirect URLs to production domain
- Verify Supabase project allows production domain

## 🐛 Troubleshooting

### **"TypeError: fetch failed" Database Error**
**Cause:** Missing or incorrect Supabase credentials

**Solution:**
1. Verify `.env.local` exists in root directory
2. Check Supabase URL and keys are correct
3. Ensure service role key has proper permissions
4. Restart development server: `npm run dev`

### **Authentication Issues**
**Cause:** Clerk configuration problems

**Solution:**
1. Verify Clerk keys in environment variables
2. Check redirect URLs match your domain
3. Ensure user metadata schema includes `tier` field

### **RLS Policy Violations**
**Cause:** Missing or incorrect database policies

**Solution:**
1. Re-run the complete `database-setup.sql` script
2. Verify service role key is set correctly
3. Check RLS policies are enabled on both tables

### **Loading Skeleton Issues**
**Cause:** Server/client component conflicts

**Solution:**
- All components using React hooks have `'use client'` directive
- Suspense boundaries are properly configured
- Already resolved in current codebase

## 📊 Performance Features

- **Loading Skeletons**: Immediate visual feedback during data fetching
- **Suspense Boundaries**: Granular loading states
- **Database Retry Logic**: Resilient connection handling
- **Optimized Images**: Next.js Image component with Unsplash integration
- **Efficient Queries**: Indexed database queries for fast retrieval

## 🎨 Design System

- **Color Palette**: Tier-based color coding (Gray, Blue, Yellow, Purple)
- **Typography**: Modern font stack with proper hierarchy
- **Spacing**: Consistent spacing scale using Tailwind
- **Animations**: Subtle hover effects and loading animations
- **Accessibility**: ARIA labels and keyboard navigation support

## 📝 License

MIT License - Feel free to use this project as a template for your own applications.

---

**Built with ❤️ for the PsypherAI Technical Challenge**  
