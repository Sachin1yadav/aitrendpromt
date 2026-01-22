# 🚨 IMMEDIATE FIX for Render Deployment

## Problem
Render is auto-detecting Next.js and trying to build it, but we only want the backend.

## ✅ QUICK FIX (Do This Now):

### In Render Dashboard:

1. **Go to your service** → **Settings**
2. **Scroll to "Build & Deploy"**
3. **Change Build Command to:**
   ```
   npm install --production --ignore-scripts
   ```
   OR leave it **COMPLETELY EMPTY**
4. **Make sure Start Command is:**
   ```
   node server/index.js
   ```
5. **Click "Save Changes"**
6. **Go to "Manual Deploy"** → **"Clear build cache & deploy"**

---

## Why This Works:

- `--production`: Only installs backend dependencies (Express, Mongoose, etc.)
- `--ignore-scripts`: Skips postinstall hooks that might trigger builds
- **No build step**: Backend doesn't need building, just install and run

---

## Alternative: Empty Build Command

If the above doesn't work:

1. **Build Command**: Leave **EMPTY** (just ` `)
2. **Start Command**: `node server/index.js`
3. Render will just install dependencies and run your start command

---

## ✅ After Fix

Your backend should deploy successfully!

Test:
```bash
curl https://aitrendpromt-backend.onrender.com/api/health
```

---

**The render.yaml file is updated, but you need to manually update Render Dashboard settings for immediate fix!**

