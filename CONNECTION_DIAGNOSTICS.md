# 🔧 Connection Diagnostics & Configuration Guide

## Current Issues Found

### 1. ❌ Backend Environment Variables NOT Set on Vercel
**Problem**: Backend server needs Supabase credentials but they're missing from Vercel environment.

**Location**: [backend/supabase.js](backend/supabase.js)
```javascript
const supabaseUrl = process.env.SUPABASE_URL;  // ← EMPTY on Vercel
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;  // ← EMPTY on Vercel
```

**Current Status**: `undefined` = backend can't connect to Supabase

---

### 2. ⚠️ Frontend Hardcoded Keys (Security Risk)
**Problem**: Supabase anon key is visible in frontend code (should use environment variable).

**Location**: [supabaseClient.js](supabaseClient.js) - Lines 20-21
```javascript
const supabaseUrl = 'https://afgnyavcxsvmwpaqxbn.supabase.co';  // Hardcoded ⚠️
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5...'  // Hardcoded ⚠️
```

**Status**: ✅ Works but exposed (OK for frontend anon key, but should still be in app.json)

---

### 3. ✅ Vercel Deployment is Running
**Confirmed**: Backend successfully deployed (responds with 404 for routes)

---

## Fix #1: Set Backend Environment Variables on Vercel ✅

### Step 1: Get Your Supabase Service Key

1. Go to https://supabase.com
2. Login to your project
3. Click **Settings** → **API**
4. Copy these two values:
   - **Project URL**: `https://afgnyavcxsvmwpaqxbn.supabase.co`
   - **Service Role Key**: (starts with `eyJ...`) - DO NOT share this!

### Step 2: Add to Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on **tryeverything-backend** project
3. Click **Settings** → **Environment Variables**
4. Add these 2 variables:

```
SUPABASE_URL = https://afgnyavcxsvmwpaqxbn.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key]
```

5. Click **Save**
6. **Redeploy**: Click "Deployments" → select latest → click "Redeploy"

### Step 3: Verify Backend Connection

Test endpoint:
```
https://tryeverything-backend.vercel.app/api/products
```

Expected: Should return product data (not 404)

---

## Fix #2: Frontend Configuration (Optional but Recommended)

### Current Setup
Frontend hardcodes Supabase URL & anon key (OK for development, but better practice to use env vars).

### To Make It Cleaner

**File**: [app.json](app.json)
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://tryeverything-backend.vercel.app",
      "supabaseUrl": "https://afgnyavcxsvmwpaqxbn.supabase.co",
      "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

Then update [supabaseClient.js](supabaseClient.js):
```javascript
const config = Constants.expoConfig?.extra || {};
const supabaseUrl = config.supabaseUrl || 'https://afgnyavcxsvmwpaqxbn.supabase.co';
const supabaseAnonKey = config.supabaseAnonKey || 'eyJ...';
```

---

## Fix #3: Add Health Check Endpoint (Backend)

### Problem
No `/health` endpoint exists - test shows 404

### Solution
Add to [backend/index.js](backend/index.js):

```javascript
// Add this BEFORE error handling middleware (line 40)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    supabase: process.env.SUPABASE_URL ? '✅ Connected' : '❌ Not configured'
  });
});
```

---

## Connection Test Checklist

After making changes, test each in order:

### Test 1: Backend Health Check
```bash
curl https://tryeverything-backend.vercel.app/health
```
**Expected Response**:
```json
{
  "status": "OK",
  "uptime": 123.45,
  "supabase": "✅ Connected"
}
```

### Test 2: Backend API Endpoint
```bash
curl https://tryeverything-backend.vercel.app/api/products
```
**Expected Response**: Array of products (not empty array is OK)

### Test 3: Frontend Connection (Run in Expo Go)
```javascript
// Open browser console in Expo Go or run in terminal
const response = await fetch('https://tryeverything-backend.vercel.app/health');
const data = await response.json();
console.log(data);
```

---

## Environment Variables Reference

### Backend Needs (Vercel)
```
SUPABASE_URL                    = https://afgnyavcxsvmwpaqxbn.supabase.co
SUPABASE_SERVICE_ROLE_KEY       = eyJ... (from Supabase Settings)
NODE_ENV                        = production
PORT                            = (auto-set by Vercel)
```

### Frontend Needs (app.json)
```
extra.apiUrl                    = https://tryeverything-backend.vercel.app
```

### Frontend Has (hardcoded - OK for now)
```
SUPABASE_URL                    = https://afgnyavcxsvmwpaqxbn.supabase.co
SUPABASE_ANON_KEY               = eyJ... (OK to hardcode for frontend)
```

---

## Troubleshooting

### Issue: "Cannot reach Supabase"
**Cause**: Backend environment variables not set
**Fix**: Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel

### Issue: "Backend returns 404"
**Cause**: Routes not loading or server error
**Fix**: Check backend logs on Vercel dashboard

### Issue: "DNS resolution error for Supabase"
**Cause**: Network/DNS issue OR no internet
**Fix**: 
  1. Test: `ping afgnyavcxsvmwpaqxbn.supabase.co`
  2. Check internet connection
  3. Try VPN off/on

### Issue: "Unauthorized" errors from backend
**Cause**: Auth token missing or expired
**Fix**: Ensure auth middleware is checking tokens correctly

---

## Security Notes

⚠️ **Never commit**:
- Supabase Service Role Key
- Database passwords
- API tokens

✅ **Safe to commit**:
- Supabase URL (it's public anyway)
- Supabase anon key (frontend only, has RLS restrictions)

✅ **Use Vercel Secrets for**:
- Service Role Key
- Any other sensitive keys

---

## Next Steps

1. **Set environment variables on Vercel** (most important)
2. **Add health check endpoint** to backend
3. **Test connections** with curl or browser
4. **Update documentation** if any changes
5. **Update frontend** to use env variables (optional but recommended)

---

## How to Get Supabase Credentials

### If you don't have them yet:

1. Go to https://supabase.com/dashboard
2. Create a new project or select existing
3. Wait for it to be created (~2 minutes)
4. Go to **Settings** → **API**
5. Copy:
   - `Project URL` - use for `SUPABASE_URL`
   - `Service Role Key` - use for `SUPABASE_SERVICE_ROLE_KEY`
   - `Anon Key` - use in frontend (already in code)

---

## Verification Checklist

- [ ] Copied Supabase Service Role Key
- [ ] Added `SUPABASE_URL` to Vercel
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` to Vercel
- [ ] Clicked "Redeploy" on Vercel
- [ ] Waited 2-3 minutes for redeployment
- [ ] Tested `/health` endpoint
- [ ] Tested `/api/products` endpoint
- [ ] Frontend can reach backend
- [ ] No 404 errors

---

**Status**: Ready to fix! Follow steps above in order.
