# 🔑 How to Get Your OpenAI API Key

## Step-by-Step Guide

### Step 1: Create/Login to OpenAI Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Click **"Sign up"** (if new) or **"Log in"** (if you have an account)
3. You can sign up with:
   - Email and password
   - Google account
   - Microsoft account

### Step 2: Add Payment Method (Required)

⚠️ **Important**: OpenAI requires a payment method to use the API (even for free tier)

1. After logging in, you'll be prompted to add payment
2. Click **"Add payment method"** or go to **Settings** → **Billing**
3. Add a credit card (they charge per usage, very cheap for testing)
4. You'll get $5 free credit to start!

### Step 3: Create API Key

1. Once logged in, look at the left sidebar
2. Click on **"API keys"** (or go to: [platform.openai.com/api-keys](https://platform.openai.com/api-keys))

3. You'll see a page that says "API keys"
4. Click the **"+ Create new secret key"** button

5. A popup will appear:
   - **Name** (optional): Give it a name like "CreatorSpace" or "My Project"
   - Click **"Create secret key"**

6. ⚠️ **IMPORTANT**: Copy the key immediately!
   - It will show something like: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **You can only see it once!** If you close this, you'll need to create a new one
   - Copy it and save it somewhere safe

### Step 4: Save Your Key

Save your API key in a safe place:
- Password manager (recommended)
- Text file (make sure it's secure)
- Notes app

**Format**: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Visual Guide

```
OpenAI Platform
│
├── 🏠 Home
│
├── 🔑 API keys          ← CLICK HERE
│   └── [+ Create new secret key]  ← CLICK THIS
│       └── [Name your key]
│           └── [Create secret key]
│               └── [COPY THE KEY IMMEDIATELY!]
│
└── 💳 Billing (add payment method here)
```

## Quick Links

- **Login/Signup**: [platform.openai.com](https://platform.openai.com)
- **API Keys Page**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Billing**: [platform.openai.com/account/billing](https://platform.openai.com/account/billing)

## Pricing Info

- **GPT-3.5-turbo**: Very cheap (~$0.001 per request)
- **Free credit**: $5 when you sign up
- **Pay-as-you-go**: Only charged for what you use
- For CreatorSpace, costs will be minimal (we cache responses!)

## Troubleshooting

**"I can't find API keys"**
- Make sure you're logged in
- Check the left sidebar menu
- Try: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

**"It asks for payment"**
- This is required (even for free tier)
- Add a credit card (you get $5 free credit)
- Very cheap to use (pennies per day for testing)

**"I lost my key"**
- No problem! Just create a new one
- Delete the old one for security
- Update it in Vercel environment variables

## Next Steps

Once you have your key:
1. ✅ Copy it (starts with `sk-proj-...`)
2. ✅ Save it securely
3. ✅ Add it to Vercel as `OPENAI_API_KEY` (when deploying)

---

**Your API key format**: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

