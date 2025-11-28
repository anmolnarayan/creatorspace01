# Deployment Guide

## Prerequisites

1. **Supabase Project**
   - Create a project at [supabase.com](https://supabase.com)
   - Note your project URL and anon key
   - Get your service role key from Settings > API

2. **OpenAI Account**
   - Sign up at [openai.com](https://openai.com)
   - Generate an API key from the dashboard

3. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

## Step-by-Step Deployment

### 1. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run it in the SQL Editor
5. Verify tables are created in the Table Editor

### 2. Seed Initial Data

Option A: Using the seed script locally:
```bash
# Set up .env.local with your Supabase credentials
npm run db:seed
```

Option B: Using the admin UI:
1. Deploy the app first
2. Create an admin user (update role in Supabase dashboard)
3. Navigate to `/admin/seed`
4. Click "Run Seed Script"

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
5. Deploy!

### 4. Set Up GitHub Actions

1. Go to your GitHub repository Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Push to main/develop branch to trigger CI

### 5. Configure Supabase Auth

1. In Supabase dashboard, go to Authentication > URL Configuration
2. Add your Vercel URL to "Site URL"
3. Add `https://your-app.vercel.app/**` to "Redirect URLs"

### 6. Create Admin User

Run this SQL in Supabase SQL Editor:
```sql
-- Replace with your email
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Or create a user through signup, then update their role.

## Post-Deployment Checklist

- [ ] Database schema migrated
- [ ] Seed data loaded
- [ ] Environment variables set in Vercel
- [ ] Supabase Auth URLs configured
- [ ] Admin user created
- [ ] Test signup/login flow
- [ ] Test project creation
- [ ] Test mentor review flow
- [ ] Test portfolio sharing

## Monitoring

- Check Vercel deployment logs for build errors
- Monitor Supabase dashboard for database usage
- Check OpenAI dashboard for API usage
- Set up error monitoring (optional: Sentry)

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### Database Errors
- Verify RLS policies are set correctly
- Check service role key is correct
- Ensure migration was run successfully

### Auth Issues
- Verify redirect URLs in Supabase
- Check email confirmation settings
- Ensure RLS policies allow access

## Production Optimizations

1. Enable Supabase connection pooling
2. Set up Redis for AI cache (optional)
3. Configure CDN for static assets
4. Set up monitoring and alerts
5. Configure backup strategy

