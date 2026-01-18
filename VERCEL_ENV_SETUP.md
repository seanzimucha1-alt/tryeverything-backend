# 📋 Step-by-Step: Set Vercel Environment Variables

## Step 1: Get Supabase Credentials

### Open Supabase
1. Go to https://supabase.com/dashboard
2. Select your project: **"afgnyavcxsvmwpaqxbn"** (or create if missing)
3. Click **Settings** (gear icon on left sidebar)
4. Click **API**
5. You should see:

```
Project URL:
https://afgnyavcxsvmwpaqxbn.supabase.co

Service Role Key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZ255YXZ...
(very long string, don't share!)
```

### Copy These 2 Values
- **Project URL** (will use for `SUPABASE_URL`)
- **Service Role Key** (will use for `SUPABASE_SERVICE_ROLE_KEY`)

---

## Step 2: Add to Vercel

### Open Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Find and click **tryeverything-backend** project
3. Click **Settings** tab (top navigation)
4. Click **Environment Variables** (left sidebar)

You should see a form like:
```
[Input Field] [Value] [Delete]
```

### Add Variable #1
- **Name**: `SUPABASE_URL`
- **Value**: `https://afgnyavcxsvmwpaqxbn.supabase.co`
- Click **Save**

### Add Variable #2
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: (paste the long key from Supabase)
- Click **Save**

After saving, you should see:
```
✓ SUPABASE_URL
✓ SUPABASE_SERVICE_ROLE_KEY
```

---

## Step 3: Redeploy on Vercel

### Trigger Redeployment
1. Go back to Vercel dashboard
2. Click **Deployments** tab
3. Find the latest deployment (usually at top)
4. Click the three dots **(...)**
5. Click **Redeploy**
6. Wait 2-3 minutes for redeployment

You'll see:
```
Status: Building...
Status: Ready ✓
```

---

## Step 4: Verify It Works

### Test Health Endpoint
```bash
curl https://tryeverything-backend.vercel.app/health
```

Expected response:
```json
{
  "status": "OK",
  "uptime": 123.45,
  "environment": "production",
  "supabase": "✅ Configured",
  "backend_url": "https://tryeverything-backend.vercel.app"
}
```

### If you see "✅ Configured" → SUCCESS! ✅

---

## Step 5: Test Full Connection

### Run Test Script
```bash
cd C:\Users\sean\Desktop\tryeverything
node testConnections.js
```

Expected output:
```
🧪 TRY EVERYTHING - Connection Tests
═══════════════════════════════════════════════════

🔗 Testing Vercel Backend Connection...
Backend URL: https://tryeverything-backend.vercel.app
Status: 200 OK
✅ Backend Health Check: OK

🔗 Testing Supabase Connection...
Supabase URL: https://afgnyavcxsvmwpaqxbn.supabase.co
Status: 200 OK
✅ Supabase Connection: OK

📡 Testing API Endpoints...
  ✅ Get Products: 200 OK
  ✅ Get Stores: 200 OK
  ✅ Health Check: 200 OK

📊 Test Summary:
Backend: ✅ Connected
Supabase: ✅ Connected
═══════════════════════════════════════════════════
```

---

## Visual Checklist

```
Step 1: Get Credentials
├─ [ ] Go to Supabase dashboard
├─ [ ] Copy Project URL
└─ [ ] Copy Service Role Key

Step 2: Add to Vercel
├─ [ ] Go to Vercel dashboard
├─ [ ] Open tryeverything-backend
├─ [ ] Go to Settings → Environment Variables
├─ [ ] Add SUPABASE_URL
├─ [ ] Add SUPABASE_SERVICE_ROLE_KEY
└─ [ ] Click Save

Step 3: Redeploy
├─ [ ] Go to Deployments tab
├─ [ ] Click Redeploy on latest
└─ [ ] Wait for "Ready ✓" status (2-3 min)

Step 4: Verify
├─ [ ] Test /health endpoint
├─ [ ] See "✅ Configured" in response
└─ [ ] Run testConnections.js

Step 5: Success!
└─ [ ] All tests pass ✅
```

---

## Troubleshooting

### Problem: "Supabase: ❌ Not configured" in health check
**Cause**: Environment variables not set or redeploy didn't happen  
**Fix**: 
1. Check variables are saved in Vercel
2. Click Redeploy again
3. Wait 5 minutes
4. Test again

### Problem: Still getting 404 errors
**Cause**: Vercel hasn't finished redeploying  
**Fix**: 
1. Wait 3-5 minutes
2. Refresh page
3. Try test again

### Problem: Can't find Service Role Key
**Cause**: Looking in wrong place or project  
**Fix**:
1. Make sure you're in right Supabase project
2. Go to Settings (gear icon) → API
3. Look for "Service Role Key" section
4. If not there, create new project

### Problem: Key format looks wrong
**Cause**: Copied anon key instead of service role key  
**Fix**: 
1. Go back to Supabase Settings → API
2. Make sure you're copying "Service Role Key" (not "Anon Key")
3. Service role key is longer and starts with `eyJ...`

---

## Important Notes

⚠️ **Service Role Key is SECRET**:
- Don't share it
- Don't commit it to GitHub
- Only paste in Vercel environment variables
- Never hardcode in frontend

✅ **Vercel keeps it secure**:
- Only available at runtime
- Not visible in deployed code
- Can't be reverse-engineered

---

## Expected Timeline

1. Add variables: **5 minutes**
2. Redeploy: **2-3 minutes**
3. Test: **1 minute**
4. Total: **8-10 minutes**

---

## Next After This Works

Once connections are verified:
1. Video system is ready to use
2. Backend can create tables
3. Frontend can upload videos
4. Supabase storage ready for files

Ready? Start with **Step 1** above! 🚀
