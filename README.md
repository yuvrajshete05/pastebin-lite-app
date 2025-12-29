# Pastebin Lite

A simple, fast, and secure text sharing application built with Next.js. Create pastes, share links, and optionally set time-based expiry or view count limits.

## Features

- 📝 **Create Pastes** - Share text snippets instantly
- 🔒 **Privacy Controls** - Set optional view limits and TTL (time-to-live)
- ⏰ **Auto Expiry** - Pastes automatically expire after a set time
- 👀 **View Limits** - Control how many times a paste can be viewed
- 🔗 **Shareable Links** - Get unique URLs for each paste
- 🚀 **Fast & Reliable** - Built on Next.js with persistent storage
- 🌐 **Fully Deployed** - Ready for production on Vercel
- 💾 **Persistent Storage** - Data stored in Supabase

## Tech Stack

- **Frontend**: Next.js 16+ (React, TypeScript, Tailwind CSS)
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (managed cloud database)
- **Persistence**: Supabase ensures data survives across requests
- **ID Generation**: nanoid
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier at https://supabase.com)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yuvrajshete05/pastebin-lite-app.git
   cd pastebin-lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create Supabase Database**
   - Go to https://supabase.com and create a new project
   - In your project, go to **SQL Editor**
   - Create a new query and paste the SQL from `database.sql`:
   ```sql
   CREATE TABLE pastes (
     id TEXT PRIMARY KEY,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     ttl_seconds INTEGER,
     max_views INTEGER,
     views_count INTEGER DEFAULT 0
   );
   
   CREATE INDEX idx_pastes_created_at ON pastes(created_at);
   CREATE INDEX idx_pastes_id ON pastes(id);
   ```
   - Run the query to create the table

4. **Configure Environment Variables**
   - Create or update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   TEST_MODE=0
   ```
   - Get credentials from Supabase Dashboard → Settings → API → Project URL and Anon Key

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Open http://localhost:3000 in your browser
   - Create a paste and view it via the shareable link

6. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns `{ "ok": true }` if the application and database are healthy.

### Create a Paste
```
POST /api/pastes
Content-Type: application/json

{
  "content": "Your text here",
  "ttl_seconds": 3600,      // Optional: expire after 1 hour
  "max_views": 5            // Optional: expire after 5 views
}
```

**Response (201):**
```json
{
  "id": "abc123xyz",
  "url": "https://your-app.com/p/abc123xyz"
}
```

### Fetch a Paste (API)
```
GET /api/pastes/:id
```

**Response (200):**
```json
{
  "content": "Your text here",
  "remaining_views": 4,      // null if unlimited
  "expires_at": "2026-01-01T00:00:00.000Z"  // null if no TTL
}
```

**Notes:**
- Each fetch increments the view counter
- Returns 404 if paste is expired, view limit exceeded, or not found

### View a Paste (HTML)
```
GET /p/:id
```
Returns HTML page displaying the paste content. Returns 404 if unavailable.

## Persistence Layer: Supabase

**Why Supabase?**

The application uses **Supabase** (a managed cloud database platform) for persistent storage. This is critical because:

- ✅ **Serverless-Compatible** - Vercel is serverless; in-memory storage gets wiped on each request. Supabase persists data permanently.
- ✅ **No Infrastructure** - Fully managed, no databases to run yourself
- ✅ **Free Tier** - 500MB storage and 2GB bandwidth included
- ✅ **Real-time Capabilities** - Optional live updates
- ✅ **Automatic Backups** - Your data is always safe
- ✅ **Easy Setup** - No complex migrations

**Database Structure:**
```
Table: pastes
├── id (TEXT, PRIMARY KEY) - Unique paste identifier
├── content (TEXT) - The paste text content
├── created_at (TIMESTAMP) - When the paste was created
├── ttl_seconds (INTEGER, nullable) - Time-to-live in seconds
├── max_views (INTEGER, nullable) - Maximum number of views allowed
└── views_count (INTEGER) - Current number of views
```

**How It Works:**
1. When you create a paste, the content is saved to Supabase
2. Each time someone views the paste, Supabase increments the view counter
3. On fetch, we check TTL and view limits against Supabase data
4. When constraints are met, Supabase returns 404 (unavailable)
5. All data persists across Vercel deployments and request cycles

## Design Decisions

1. **Nanoid for ID Generation**
   - Short, URL-safe, collision-resistant unique IDs
   - Examples: `XT85fZWbDS`, `nZpJ9bqsY3`
   - Better than UUIDs for URLs

2. **Supabase for Persistence**
   - Only persistence solution that survives serverless request cycles
   - Free tier sufficient for this use case
   - Built-in real-time and backup capabilities
   - No connection pooling headaches

3. **Separate /view Endpoint**
   - `/api/pastes/:id/view` endpoint for incrementing views
   - Prevents double-counting on initial page load
   - Clean separation: GET /p/:id (no increment), GET /api/pastes/:id/view (increment)

4. **Lazy Expiry Check**
   - Check TTL/view limits only when paste is accessed
   - No background jobs or scheduled cleanups needed
   - Data stays in database (archived)

5. **Combined Constraints**
   - If both TTL and max_views are set, whichever triggers first makes paste unavailable
   - Logic: `if expired OR views_exceeded THEN return 404`

6. **Test Mode Support**
   - `x-test-now-ms` header for deterministic testing
   - Allows testing expiry without waiting
   - Set `TEST_MODE=1` environment variable

7. **Tailwind CSS Styling**
   - Dark gradient theme with animated blobs
   - Clean, modern UI with good contrast
   - Responsive design (mobile-friendly)
   - White form inputs with dark text for visibility

## Constraints on a Paste

A paste can have:
- **No constraints** - Available forever until deleted
- **TTL Only** - Expires after `ttl_seconds` seconds
- **View Limit Only** - Available for `max_views` fetches
- **Both TTL and View Limit** - Becomes unavailable when either constraint triggers

## Testing

### Local Testing
```bash
npm run dev
# Navigate to http://localhost:3000
```

### Test Mode (Deterministic Time)
```bash
TEST_MODE=1 npm run dev
```

Then make requests with the `x-test-now-ms` header:
```bash
curl -H "x-test-now-ms: 1704067200000" http://localhost:3000/api/pastes/abc123
```

### Example Test Cases

1. **Create a paste with view limit:**
   - Content: "Hello"
   - Max Views: 1
   - First fetch: 200 OK
   - Second fetch: 404 Not Found

2. **Create a paste with TTL:**
   - Content: "Test"
   - TTL: 60 seconds
   - Fetch before 60s: 200 OK
   - Fetch after 60s: 404 Not Found

## Deployment on Vercel

### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select your repository

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add these variables:
     - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
     - `NEXT_PUBLIC_APP_URL` - Your Vercel domain (e.g., https://your-app.vercel.app)
   - Do NOT add `TEST_MODE` (defaults to 0)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app is now live!

5. **Test Your Deployment**
   - Visit https://your-app.vercel.app
   - Create a paste
   - Share the link and verify it works
   - Check `/api/healthz` returns `{"ok": true}`

**Important:** The environment variables must be added to Vercel BEFORE deployment, or the app will fail with "Cannot access Supabase".


---

## Project Structure

```
pastebin-lite/
├── app/
│   ├── api/
│   │   ├── healthz/
│   │   │   └── route.ts           # Health check endpoint
│   │   └── pastes/
│   │       ├── route.ts           # POST to create paste
│   │       └── [id]/
│   │           ├── route.ts       # GET to fetch paste
│   │           └── view/
│   │               └── route.ts   # GET to view + count
│   ├── p/
│   │   └── [id]/
│   │       └── page.tsx           # HTML page display
│   └── page.tsx                   # Home page
├── components/
│   ├── CreatePasteForm.tsx        # Form UI
│   └── PasteDisplay.tsx           # Display + metadata
├── lib/
│   ├── supabase.ts                # Supabase client
│   └── db.ts                      # Database helpers
├── .env.local                     # Env vars (local only)
├── database.sql                   # DB schema
└── README.md
```
