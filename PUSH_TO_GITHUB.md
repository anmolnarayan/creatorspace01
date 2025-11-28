# 🚀 Push to GitHub - Step by Step

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon (top right) → "New repository"
3. Fill in:
   - **Repository name**: `creatorspace` (or any name you want)
   - **Description**: (optional) "AI-Powered Cofounder & Campus Launchpad"
   - **Visibility**: Public or Private (your choice)
   - ⚠️ **DO NOT** check "Initialize with README" (we already have files)
4. Click "Create repository"

## Step 2: Copy Your Repository URL

After creating the repo, GitHub will show you a page with setup instructions.
You'll see a URL like:
```
https://github.com/YOUR_USERNAME/creatorspace.git
```

**Copy this URL** - you'll need it in the next step.

## Step 3: Run These Commands

Open your terminal and run these commands (I'll help you with the exact commands):

```bash
cd /Users/anmolnarayan/CreativeSpace

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/creatorspace.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

## Step 4: Authenticate

When you run `git push`, GitHub will ask you to authenticate:
- **Option 1**: Use GitHub CLI (if installed)
- **Option 2**: Use a Personal Access Token
  - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` permissions
  - Use token as password when prompted

## That's It!

Your code will be pushed to GitHub and ready for Vercel deployment.

