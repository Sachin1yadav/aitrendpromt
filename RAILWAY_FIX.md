# Railway Deployment Fix

## Problem
Railway is trying to build Next.js (frontend) instead of just running the backend.

## Solution

### Option 1: Use Railway Settings (Easiest)

1. **Go to Railway Dashboard**
2. **Select your service**
3. **Go to Settings tab**
4. **Under "Build & Deploy":**
   - **Build Command**: Leave EMPTY or set to: `echo "Backend - no build needed"`
   - **Start Command**: `node server/index.js`
5. **Save and redeploy**

### Option 2: Create `.railwayignore` file

Create a file named `.railwayignore` in the root:

```
.next
out
node_modules/.cache
```

### Option 3: Use nixpacks.toml (Already created)

The `nixpacks.toml` file is already created. Railway should use it automatically.

If it doesn't work:
1. Go to Railway Settings
2. Set **Build Command** to: (empty)
3. Set **Start Command** to: `node server/index.js`

### Option 4: Deploy Only Backend Folder

If above doesn't work, you can:
1. Create a separate branch for backend
2. Or use Railway's "Deploy from subdirectory" feature
3. Point it to the root but skip Next.js build

---

## Quick Fix Steps:

1. **Railway Dashboard** → Your Service → **Settings**
2. **Build Command**: (empty or `echo "skip"`)
3. **Start Command**: `node server/index.js`
4. **Redeploy**

---

## Alternative: Use Render Instead

If Railway continues to have issues, use Render:

1. Go to https://render.com
2. New Web Service
3. Connect GitHub repo
4. Settings:
   - **Build Command**: (leave empty)
   - **Start Command**: `node server/index.js`
5. Add environment variables
6. Deploy

Render is simpler for backend-only deployments.

