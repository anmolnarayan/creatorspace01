# 🚀 Quick Deploy to Vercel - Follow These Steps

## STEP 1: Initialize Git & Push to GitHub

Run these commands in your terminal:

```bash
cd /Users/anmolnarayan/CreativeSpace

# Initialize git
git init
git add .
git commit -m "Initial commit: CreatorSpace MVP"

# Create a new repository on GitHub first, then:
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/creatorspace.git
git branch -M main
git push -u origin main
```

**How to create GitHub repo:**
1. Go to github.com → Click "+" → "New repository"
2. Name it: `creatorspace`
3. Don't initialize with README
4. Click "Create repository"
5. Copy the commands GitHub shows you

---

## STEP 2: Set Up Supabase

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Click "New Project"
3. Fill in:
   - Name: `creatorspace`
   - Password: (create strong password, save it!)
   - Region: (choose closest)
4. Click "Create new project"
5. Wait 2-3 minutes

### 2.2 Get Your Keys
1. In Supabase dashboard → **Settings** → **API**
2. Copy these (save them!):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...` - click "Reveal")

### 2.3 Run Database Migration
1. In Supabase dashboard → **SQL Editor**
2. Click "New query"
3. Open file: `supabase/migrations/001_initial_schema.sql`
4. Copy ALL the SQL code
5. Paste into SQL Editor
6. Click "Run" (or Cmd+Enter)
7. Should see "Success. No rows returned"
8. Verify: Go to **Table Editor** - you should see tables

---

## STEP 3: Deploy to Vercel

### 3.1 Import Project
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click "Add New..." → "Project"
3. Find your `creatorspace` repo
4. Click "Import"

### 3.2 Add Environment Variables
**BEFORE clicking Deploy**, click "Environment Variables" and add:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase Project URL
   - Add to: Production, Preview, Development

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your anon public key
   - Add to: Production, Preview, Development

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: Your service_role key
   - Add to: Production, Preview, Development

4. **OPENAI_API_KEY**
   - Value: Your OpenAI API key (get from platform.openai.com)
   - Add to: Production, Preview, Development

5. **NEXT_PUBLIC_APP_URL**
   - Value: `https://your-project-name.vercel.app` (update after first deploy)
   - Add to: Production, Preview, Development

### 3.3 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Click the deployment URL when ready

---

## STEP 4: Configure Supabase Auth

1. Go back to Supabase → **Authentication** → **URL Configuration**
2. In "Site URL": Add your Vercel URL
3. In "Redirect URLs": Add `https://your-project.vercel.app/**`
4. Click "Save"

---

## STEP 5: Seed Database & Create Admin

### Option A: Using Admin UI (Easiest)

1. **Create admin user:**
   - Sign up at your Vercel site: `https://your-project.vercel.app/signup`
   - Then in Supabase SQL Editor, run:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

2. **Seed data:**
   - Log in to your site
   - Go to: `https://your-project.vercel.app/admin/seed`
   - Click "Run Seed Script"

### Option B: Using Local Script

1. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

2. Run:
```bash
npm install
npm run db:seed
```

---

## STEP 6: Test Your Site

Visit your Vercel URL and test:
- ✅ Landing page loads
- ✅ Sign up works
- ✅ Login works
- ✅ Dashboard shows
- ✅ Launch packs page works

---

## 🎉 You're Live!

Your site URL: `https://your-project.vercel.app`

**Need help?** Check `VERCEL_DEPLOYMENT.md` for detailed troubleshooting.

