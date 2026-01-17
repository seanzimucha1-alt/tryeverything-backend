# Vercel Deployment - Step by Step

## Quick Steps to Deploy Your Backend

### Step 1: Prepare Your Code

✅ Your `backend/` folder is ready with `vercel.json`
✅ Backend code is configured for serverless functions
✅ Environment variables need to be set

### Step 2: Deploy to Vercel (Choose One Method)

#### Method A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Root Directory**: Select `backend` folder
   - **Framework Preset**: "Other"
   - **Build Command**: Leave empty (or `npm install`)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add these one by one:

   **Required:**
   ```
   SUPABASE_URL = https://afgnyavcxsvmwpaqxbn.supabase.co
   ```

   ```
   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZ255YXZjeHN2bXdwYXhxYm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNjg5ODMsImV4cCI6MjA4Mzk0NDk4M30.172TemagW0zJg8A02whzm1ZdIySwlchXWvBNw2yxfLU
   ```

   **IMPORTANT - Get this from Supabase:**
   ```
   SUPABASE_SERVICE_ROLE_KEY = [Get from Supabase Dashboard → Settings → API → service_role key]
   ```
   
   How to get Service Role Key:
   - Go to https://supabase.com/dashboard
   - Select your project
   - Settings (gear icon) → API
   - Copy the `service_role` key (NOT the anon key)

   **Optional (for later):**
   ```
   PAYNOW_INTEGRATION_ID = [Your PayNow ID]
   PAYNOW_INTEGRATION_KEY = [Your PayNow Key]
   ```

   ```
   NODE_ENV = production
   ```

5. **Deploy**
   - Click "Deploy" button
   - Wait 2-5 minutes for deployment

6. **Get Your URL**
   - After deployment, copy your Vercel URL
   - It will look like: `https://your-project-name.vercel.app` or `https://your-project-name-[hash].vercel.app`

#### Method B: Via CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Navigate to backend folder
cd backend

# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# Deploy to production
vercel --prod
```

### Step 3: Update Frontend with Vercel URL

1. **Open `app.json` in your project root**

2. **Replace the placeholder URL**:
   ```json
   "extra": {
     "apiUrl": "https://your-actual-vercel-url.vercel.app"
   }
   ```
   
   Replace `your-actual-vercel-url.vercel.app` with your actual Vercel URL from Step 2

3. **Save the file**

### Step 4: Test the Connection

1. **Start Expo**:
   ```bash
   npm start
   # or
   expo start
   ```

2. **Open in Expo Go** on your phone

3. **Test Login**:
   - Try signing in with an existing account
   - Or register a new account
   - Check Vercel logs to see if requests are coming through

### Step 5: Verify Everything Works

#### Check Vercel Logs
- Go to Vercel Dashboard → Your Project → Logs tab
- Try logging in from Expo Go
- You should see API requests in the logs

#### Check Supabase Database
- Go to Supabase Dashboard → Table Editor
- Open `profiles` table
- Try creating a new user - you should see them appear in the table

#### Test API Directly
Open in browser (should show error - that's OK):
```
https://your-vercel-url.vercel.app/api/auth/profile
```
Expected response: `{"error":"Access token required"}` (this means the API is working!)

### Troubleshooting

**Problem: 404 errors**
- ✅ Check your Vercel URL is correct in `app.json`
- ✅ Make sure you deployed the `backend` folder, not root

**Problem: CORS errors**
- ✅ Already configured in `backend/index.js` - should work
- ✅ Check Vercel logs for CORS-related errors

**Problem: Authentication not working**
- ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- ✅ Check Supabase Dashboard → Settings → API for correct keys

**Problem: Database connection fails**
- ✅ Check `SUPABASE_URL` is correct in Vercel environment variables
- ✅ Verify Supabase project is active

**Problem: Environment variables not working**
- ✅ Make sure you set them in Vercel Dashboard (not just `.env`)
- ✅ Redeploy after adding environment variables

### Quick Checklist

Before testing:
- [ ] Backend deployed to Vercel
- [ ] Got Vercel URL (copy it!)
- [ ] Set `SUPABASE_URL` in Vercel environment variables
- [ ] Set `SUPABASE_ANON_KEY` in Vercel environment variables  
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel environment variables
- [ ] Updated `app.json` with your Vercel URL
- [ ] Restarted Expo Go app

### Next Steps (After Login Works)

Once sign-in works, we'll implement:
1. ✅ Video uploads to Supabase Storage
2. ✅ Store product uploads
3. ✅ Deliverer vetting system

---

## Summary

**The flow is:**
```
Expo Go App → Vercel Backend (API) → Supabase (Database)
```

**Key Files:**
- `backend/vercel.json` - Vercel configuration (already done)
- `backend/index.js` - Main server file (already configured)
- `app.json` - Frontend config (needs your Vercel URL)
- `supabaseClient.js` - Reads from `app.json` automatically

**After deployment, just update `app.json` with your Vercel URL and you're done!**
