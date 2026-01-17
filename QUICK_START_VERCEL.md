# Quick Start: Deploy to Vercel in 5 Minutes

## What You Need

1. Vercel account (free) - https://vercel.com/signup
2. Your Supabase Service Role Key (from Supabase Dashboard)

## Step-by-Step Instructions

### 1️⃣ Deploy Backend to Vercel

**Go to Vercel Dashboard:**
1. Visit https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository (connect if needed)
4. **IMPORTANT**: Under "Root Directory", select **`backend`** folder
5. Framework: Select "Other"
6. Click "Deploy" (you'll add env vars after)

**Wait for deployment to finish** (~2 minutes)

**Copy your Vercel URL** - it will look like:
```
https://your-project-name.vercel.app
```
or
```
https://your-project-name-[random].vercel.app
```

### 2️⃣ Add Environment Variables in Vercel

**In your Vercel project dashboard:**

1. Go to **Settings** → **Environment Variables**
2. Add these one by one:

| Variable Name | Value | Where to Get It |
|--------------|-------|----------------|
| `SUPABASE_URL` | `https://afgnyavcxsvmwpaqxbn.supabase.co` | Already have it |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Already have it |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Get from Supabase | **Read below** |
| `NODE_ENV` | `production` | Just type it |

**To get SUPABASE_SERVICE_ROLE_KEY:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Scroll down to **Project API keys**
5. Copy the **`service_role`** key (secret key - keep it safe!)
6. Paste it in Vercel as `SUPABASE_SERVICE_ROLE_KEY`

**After adding all variables:**
- Click "Save"
- Go to **Deployments** tab
- Click the "..." menu on latest deployment
- Click **Redeploy** to apply new environment variables

### 3️⃣ Update Frontend Configuration

**Open `app.json` in your project root:**

Find this line (around line 11):
```json
"apiUrl": "https://YOUR-VERCEL-URL-HERE.vercel.app"
```

Replace `YOUR-VERCEL-URL-HERE.vercel.app` with your actual Vercel URL from Step 1.

**Example:**
If your Vercel URL is `https://tryeverything-backend.vercel.app`, then:
```json
"apiUrl": "https://tryeverything-backend.vercel.app"
```

**Save the file**

### 4️⃣ Test the Connection

**Start Expo:**
```bash
npm start
```

**Open in Expo Go** on your phone

**Try logging in** - it should now connect to Vercel → Supabase!

### 5️⃣ Verify It's Working

**Check Vercel Logs:**
- Go to Vercel Dashboard → Your Project → **Logs** tab
- Try logging in from Expo Go
- You should see API requests appear in logs

**Check Supabase:**
- Go to Supabase Dashboard → **Table Editor** → `profiles`
- Try registering a new user
- You should see the user appear in the `profiles` table

**Test API Directly:**
Open in browser: `https://your-vercel-url.vercel.app/api/auth/profile`

Should see: `{"error":"Access token required"}` ✅ (This means it's working!)

## 🎯 Quick Checklist

- [ ] Deployed backend to Vercel (selected `backend` folder as root)
- [ ] Copied Vercel URL
- [ ] Added `SUPABASE_URL` in Vercel environment variables
- [ ] Added `SUPABASE_ANON_KEY` in Vercel environment variables
- [ ] Got `SUPABASE_SERVICE_ROLE_KEY` from Supabase Dashboard → Settings → API
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` in Vercel environment variables
- [ ] Added `NODE_ENV=production` in Vercel environment variables
- [ ] Redeployed after adding environment variables
- [ ] Updated `app.json` with your Vercel URL
- [ ] Restarted Expo app
- [ ] Tested login/registration

## ⚠️ Common Issues

**"Cannot connect to API"**
- Check `app.json` has correct Vercel URL
- Make sure you deployed the `backend` folder, not root

**"Authentication failed"**
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly in Vercel
- Verify you copied the `service_role` key (not `anon` key)

**"Environment variable not found"**
- Make sure you redeployed after adding environment variables
- Check variable names match exactly (case-sensitive)

**"404 on API routes"**
- Check Vercel URL is correct
- Verify `vercel.json` exists in `backend` folder

## 📱 Next Steps (After Login Works)

1. ✅ Video uploads to Supabase Storage
2. ✅ Store product uploads  
3. ✅ Deliverer vetting system

## 🔗 The Connection Flow

```
Expo Go App (Frontend)
    ↓ (uses Vercel URL from app.json)
Vercel Backend (API)
    ↓ (uses Supabase keys from env vars)
Supabase Database (Stores users, videos, etc.)
```

**That's it! You're ready to deploy.** 🚀
