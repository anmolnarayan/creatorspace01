# 🚀 Deploy CreatorSpace to Vercel - Step-by-Step Guide

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com - free tier works)
- [ ] Supabase account (sign up at supabase.com - free tier works)
- [ ] OpenAI API key (get from platform.openai.com)

---

## Step 1: Prepare Your Code for GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
cd /Users/anmolnarayan/CreativeSpace
git init
git add .
git commit -m "Initial commit: CreatorSpace MVP"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `creatorspace` (or any name you prefer)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 1.3 Push Code to GitHub

GitHub will show you commands. Run these in your terminal:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/creatorspace.git

# Push your code
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: CreatorSpace (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine
4. Click "Create new project"
5. Wait 2-3 minutes for project to be ready

### 2.2 Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - click "Reveal")

### 2.3 Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `supabase/migrations/001_initial_schema.sql` from your project
4. Copy **ALL** the SQL code from that file
5. Paste it into the SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"
8. Verify tables were created: Go to **Table Editor** - you should see tables like `users`, `launch_packs`, `projects`, etc.

---

## Step 3: Deploy to Vercel

### 3.1 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub to sign in)
2. Click "Add New..." → "Project"
3. Find your `creatorspace` repository
4. Click "Import"

### 3.2 Configure Project Settings

Vercel will auto-detect Next.js. Keep these settings:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3.3 Add Environment Variables

**IMPORTANT**: Add these environment variables in Vercel before deploying:

Click "Environment Variables" and add each one:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase Project URL (from Step 2.2)
   - Example: `https://xxxxxxxxxxxxx.supabase.co`
   - Add to: Production, Preview, Development

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon public key (from Step 2.2)
   - Add to: Production, Preview, Development

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: Your Supabase service_role key (from Step 2.2)
   - Add to: Production, Preview, Development
   - ⚠️ Keep this secret!

4. **OPENAI_API_KEY**
   - Value: Your OpenAI API key (from platform.openai.com)
   - Add to: Production, Preview, Development
   - ⚠️ Keep this secret!

5. **NEXT_PUBLIC_APP_URL**
   - Value: Will be your Vercel URL (you can update this after first deploy)
   - For now, use: `https://your-project-name.vercel.app`
   - Add to: Production, Preview, Development
   - ⚠️ You'll update this after first deployment with the actual URL

### 3.4 Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll see "Building..." then "Ready"
4. Click the deployment URL (e.g., `https://creatorspace-xxxxx.vercel.app`)

---

## Step 4: Configure Supabase Auth

### 4.1 Update Supabase Redirect URLs

1. Go back to Supabase dashboard
2. Go to **Authentication** → **URL Configuration**
3. In "Site URL", add your Vercel URL: `https://your-project.vercel.app`
4. In "Redirect URLs", add:
   - `https://your-project.vercel.app/**`
   - `https://your-project.vercel.app/dashboard`
   - `https://your-project.vercel.app/auth/callback`
5. Click "Save"

### 4.2 Update Vercel Environment Variable

1. Go back to Vercel dashboard
2. Go to your project → **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. Redeploy (Vercel will auto-redeploy or go to Deployments → Redeploy)

---

## Step 5: Seed Your Database

### Option A: Using Admin UI (Recommended)

1. First, create an admin user:
   - Go to your Supabase dashboard → **SQL Editor**
   - Run this SQL (replace with your email):
   ```sql
   -- First, sign up through the app, then run this:
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

2. Sign up through your Vercel app:
   - Go to `https://your-project.vercel.app/signup`
   - Create an account with the email you used above

3. Update your role to admin (run the SQL above)

4. Log in and go to: `https://your-project.vercel.app/admin/seed`
5. Click "Run Seed Script"

### Option B: Using Local Script

1. Create `.env.local` file in your project:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

2. Run seed script:
```bash
npm install
npm run db:seed
```

---

## Step 6: Verify Deployment

### 6.1 Test Your Site

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test signup: Go to `/signup` and create an account
3. Test login: Log in with your account
4. Test dashboard: Should see your role-based dashboard
5. Test launch packs: Go to `/launch-packs`
6. Test project creation: Start a launch pack

### 6.2 Check for Errors

1. In Vercel dashboard, go to **Deployments**
2. Click on your deployment
3. Check **Logs** tab for any errors
4. Check **Functions** tab for API route errors

---

## Step 7: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your domain (e.g., `creatorspace.com`)
3. Follow Vercel's DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` in environment variables
5. Update Supabase redirect URLs with your custom domain

---

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Make sure all environment variables are added in Vercel
- Check that variable names match exactly (case-sensitive)

**Error: Module not found**
- Make sure `package.json` has all dependencies
- Check build logs in Vercel

### Database Errors

**Error: Relation does not exist**
- Make sure you ran the migration SQL in Supabase
- Check that all tables were created in Supabase Table Editor

**Error: RLS policy violation**
- Check that RLS policies were created (they're in the migration file)
- Verify your Supabase service role key is correct

### Auth Errors

**Error: Invalid redirect URL**
- Update Supabase redirect URLs (Step 4.1)
- Make sure `NEXT_PUBLIC_APP_URL` matches your Vercel URL

### API Errors

**Error: OpenAI API key invalid**
- Verify your OpenAI API key in Vercel environment variables
- Check OpenAI dashboard for usage limits

---

## Quick Reference: Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

---

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] Vercel project deployed
- [ ] Environment variables set
- [ ] Supabase auth URLs configured
- [ ] Database seeded
- [ ] Admin user created
- [ ] Site accessible and working
- [ ] Signup/login tested
- [ ] Project creation tested

---

## Next Steps After Deployment

1. **Monitor Usage**
   - Check Vercel analytics
   - Monitor Supabase usage
   - Track OpenAI API costs

2. **Set Up Monitoring** (Optional)
   - Add Sentry for error tracking
   - Set up Vercel analytics
   - Monitor Supabase logs

3. **Invite Users**
   - Share your Vercel URL
   - Create mentor accounts
   - Start your 30-student pilot!

---

**Your site is now live! 🎉**

Share your Vercel URL: `https://your-project.vercel.app`

