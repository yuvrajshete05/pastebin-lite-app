# Pastebin Lite

A simple, fast, and secure text sharing application built with Next.js. Create pastes, share links, and optionally set time-based expiry or view count limits.

## Features

- 📝 **Create Pastes** - Share text snippets instantly
- 🔒 **Privacy Controls** - Set optional view limits and TTL (time-to-live)
- ⏰ **Auto Expiry** - Pastes automatically expire after a set time
- 👀 **View Limits** - Control how many times a paste can be viewed
- 🔗 **Shareable Links** - Get unique URLs for each paste
- 🚀 **Fast & Reliable** - Built on Next.js with persistent storage

## Tech Stack

- **Frontend**: Next.js 16+ (React, TypeScript, Tailwind CSS)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Supabase
- **Persistence**: Supabase (survives across requests)
- **ID Generation**: nanoid

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available at https://supabase.com)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pastebin-lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create Supabase Database Schema**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Create a new query and run the SQL from `database.sql`
   - This creates the `pastes` table with proper indexes

4. **Configure Environment Variables**
   - Copy `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   TEST_MODE=0  # Set to 1 for deterministic test mode
   ```
   - Get your credentials from Supabase → Settings → API

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   - Open http://localhost:3000 in your browser

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

## Persistence Layer

**Supabase PostgreSQL Database**

The application uses Supabase's managed PostgreSQL database to store all pastes. This ensures:

- ✅ Data persists across requests (critical for serverless platforms like Vercel)
- ✅ Automatic backups and disaster recovery
- ✅ Real-time capabilities with Supabase
- ✅ Free tier with 500MB storage
- ✅ Row-level security (RLS) for data protection

**Database Schema:**
```sql
CREATE TABLE pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ttl_seconds INTEGER,
  max_views INTEGER,
  views_count INTEGER DEFAULT 0
);
```

## Design Decisions

1. **Nanoid for ID Generation** - Short, URL-safe, collision-resistant unique IDs
2. **Supabase for Persistence** - Serverless-friendly, no connection pooling needed, free tier sufficient
3. **View Counting on Fetch** - Each API fetch increments views; simple, no background jobs needed
4. **Expiry Check on Fetch** - Lazily check expiry when paste is accessed (no scheduled cleanup)
5. **Combined Constraints** - If both TTL and max_views are set, whichever triggers first unavails the paste
6. **Test Mode Support** - `x-test-now-ms` header allows deterministic testing without time delays

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

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
4. Deploy

Vercel will automatically build and deploy your app. Data persists in Supabase.

## Troubleshooting

**"Cannot access database" error:**
- Verify Supabase credentials in `.env.local`
- Check that the `pastes` table exists in Supabase
- Ensure Data API is enabled in Supabase settings

**"params is a Promise" error:**
- This is expected in Next.js 16+. Routes use async params.
- Already handled in the code.

**Paste not found after creation:**
- Check browser DevTools → Network tab
- Verify the API returned a valid ID
- Ensure Supabase credentials are correct

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
