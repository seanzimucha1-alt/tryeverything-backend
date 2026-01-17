# Deployment Guide: Vercel + Expo Go + Supabase

## Overview
This guide will help you connect your Expo Go frontend → Vercel backend → Supabase database.

## Step 1: Deploy Backend to Vercel

### Prerequisites
1. Create a Vercel account at https://vercel.com (use GitHub to sign up)
2. Install Vercel CLI (optional, for easier deployment):
   ```bash
   npm i -g vercel
   ```

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Your Repository**
   - Connect your GitHub/GitLab/Bitbucket account
   - Import the `tryeverything` repository
   - Select the `backend` folder as the Root Directory

3. **Configure Project Settings**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (or `npm install` if needed)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   SUPABASE_URL=https://afgnyavcxsvmwpaqxbn.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZ255YXZjeHN2bXdwYXhxYm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjg5ODMsImV4cCI6MjA4Mzk0NDk4M30.172TemagW0zJg8A02whzm1ZdIySwlchXWvBNw2yxfLU
   SUPABASE_SERVICE_ROLE_KEY=[Get this from Supabase Dashboard → Settings → API]
   PAYNOW_INTEGRATION_ID=[Your PayNow ID - optional for now]
   PAYNOW_INTEGRATION_KEY=[Your PayNow Key - optional for now]
   NODE_ENV=production
   ```

   **To get Supabase Service Role Key:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Go to Settings → API
   - Copy the `service_role` key (keep this secret!)

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (~2-5 minutes)

6. **Get Your Vercel URL**
   - After deployment, you'll see a URL like: `https://your-project-name.vercel.app`
   - Copy this URL - you'll need it for the frontend!

### Option B: Deploy via CLI

```bash
cd backend
vercel login
vercel
# Follow prompts, select defaults
vercel --prod  # Deploy to production
```

## Step 2: Update Frontend to Use Vercel URL

### Update API Configuration

1. **Update `app.json` or create `app.config.js`**:
   
   Create/update `app.config.js` in the root directory:
   
   ```javascript
   export default {
     expo: {
       name: "Pamusika",
       slug: "tryeverything",
       version: "1.0.0",
       extra: {
         apiUrl: "https://your-project-name.vercel.app", // Replace with your Vercel URL
       },
     },
   };
   ```

2. **Update `supabaseClient.js`**:
   
   The file is already configured to read from `expoConfig.extra.apiUrl`. Just make sure your Vercel URL is in `app.config.js`.

3. **Alternative: Hardcode for Testing** (Quick Fix)
   
   In `supabaseClient.js`, temporarily change:
   ```javascript
   return 'https://your-project-name.vercel.app'; // Replace with your Vercel URL
   ```

## Step 3: Test the Connection

### Test Login Flow

1. **Start Expo Go**:
   ```bash
   npm start
   # or
   expo start
   ```

2. **Open in Expo Go** app on your phone

3. **Test Sign In**:
   - Try logging in with an existing account
   - Or create a new account
   - Check that it connects to Supabase

### Debugging

1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for any errors

2. **Check API Endpoints**:
   - Test: `https://your-project-name.vercel.app/api/auth/profile`
   - Should return "Access token required" (expected for unauthenticated request)

3. **Common Issues**:
   - **CORS errors**: Make sure CORS is enabled in `backend/index.js` (already done)
   - **404 errors**: Check that your Vercel URL is correct
   - **Auth errors**: Verify Supabase keys in Vercel environment variables

## Step 4: Verify Database Connection

1. **Check Supabase**:
   - Go to Supabase Dashboard → Table Editor
   - Verify that `profiles` table exists
   - Try creating a user - data should appear in Supabase

2. **Test User Creation**:
   - Register a new user in Expo Go
   - Check Supabase → `auth.users` and `profiles` tables
   - User should appear in both

## Environment Variables Checklist

Make sure these are set in Vercel:

✅ `SUPABASE_URL`  
✅ `SUPABASE_ANON_KEY`  
✅ `SUPABASE_SERVICE_ROLE_KEY` (important for admin operations)  
⚠️ `PAYNOW_INTEGRATION_ID` (optional, for payments)  
⚠️ `PAYNOW_INTEGRATION_KEY` (optional, for payments)  
✅ `NODE_ENV=production`

## Quick Start Checklist

- [ ] Deploy backend to Vercel
- [ ] Copy Vercel deployment URL
- [ ] Add all environment variables to Vercel
- [ ] Update `app.config.js` with Vercel URL
- [ ] Restart Expo Go app
- [ ] Test login/registration
- [ ] Verify data appears in Supabase

## Next Steps (After Connection Works)

1. Video upload functionality
2. Store product uploads
3. Deliverer vetting system

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Expo Go console for errors
3. Verify environment variables are set correctly
4. Test API endpoints directly in browser/Postman
