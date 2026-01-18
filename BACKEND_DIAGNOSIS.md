# ?? Backend Diagnosis & Troubleshooting

## ?? Critical Issues Found

Your login is failing because of **missing environment variables on Vercel**. The backend can't connect to Supabase without them.

## ?? Step 1: Test Backend Directly

Run these in your browser or terminal:

### Test 1: Is Backend Alive?
```bash
curl https://tryeverything-backend.vercel.app/
# Expected: "Backend API is running"
```

### Test 2: Is Auth Endpoint Working?
```bash
curl https://tryeverything-backend.vercel.app/api/auth/profile
# Expected: {"error":"Access token required"}
# (This means the endpoint exists but needs auth token)
```

**If you get 500 errors or timeouts ? Backend is broken**

## ?? Step 2: Verify Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select your project: **prj_1GYTh5TXtMPPfzlnQQSlZAHGhdeN**
3. Click **Settings** ? **Environment Variables**

You **MUST** have these exactly:
```
? SUPABASE_URL = https://afgnyavcxsvmwpaqxbn.supabase.co
? SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
? SUPABASE_SERVICE_ROLE_KEY = [From Supabase Settings ? API]
? NODE_ENV = production
```

### How to Get SUPABASE_SERVICE_ROLE_KEY:
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click ?? **Settings** ? **API**
4. Copy the **service_role** key (NOT the anon key)
5. Paste into Vercel

## ?? Step 3: Redeploy After Adding Env Vars

**Important**: After adding env vars, you MUST redeploy:

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Click the "..." menu on latest deployment
4. Click **Redeploy**
5. Wait 1-2 minutes for new deployment

## ?? Step 4: Verify Login in Expo

Once backend is deployed with env vars:

```bash
# Clear cache and restart Expo
npx expo start -c

# Open in Expo Go ? try login
```

Expected behavior:
- Login takes 2-5 seconds ?
- Or shows "Login taking too long..." after 15 seconds ?

## ?? If Login Still Fails

Check Vercel logs for errors:

1. Go to Vercel Dashboard ? Your Project
2. Click **Logs** tab
3. Trigger a login attempt from Expo
4. Look for red error messages

Common errors:
- `SUPABASE_SERVICE_ROLE_KEY is undefined` ? Add to Vercel env vars
- `Cannot connect to Supabase` ? Check URL and keys
- `Invalid JWT token` ? Supabase keys don't match

## ?? Backend Login Flow

```
Expo App
    ? (sends credentials to Supabase)
Supabase Auth
    ? (returns access token)
Expo App
    ? (has token, can now use API)
Vercel Backend
    ? (verifies token, returns user data)
Expo App (Logged in ?)
```

**Your app is calling Supabase directly for login** — not using the Vercel backend for auth.
The Vercel backend only serves `/api/auth/profile` (to fetch user data after login).

## ? Next: Quick Fixes Checklist

- [ ] Test `curl https://tryeverything-backend.vercel.app/`
- [ ] Test `curl https://tryeverything-backend.vercel.app/api/auth/profile`
- [ ] Add all 4 env vars to Vercel (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NODE_ENV)
- [ ] Click **Redeploy** in Vercel
- [ ] Wait 2 minutes for deployment
- [ ] Try login in Expo again
- [ ] Check Vercel logs if still failing

---

Tell me the results of the curl commands and I'll help further! ??
