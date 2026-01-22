# 🔧 Vercel Environment Variable Setup

## ✅ Your Frontend is Deployed!

**Vercel URL**: `https://aitrendpromt.vercel.app`

---

## ⚠️ Important: Add Environment Variable in Vercel

Your frontend is deployed, but you need to add the environment variable in Vercel dashboard:

### Step 1: Go to Vercel Dashboard

1. Visit: **https://vercel.com/dashboard**
2. Click on your project: **`aitrendpromt`**

### Step 2: Add Environment Variable

1. Go to **"Settings"** tab
2. Click **"Environment Variables"** in the left sidebar
3. Click **"Add New"**
4. Add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://aitrendpromt.onrender.com`
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
5. Click **"Save"**

### Step 3: Redeploy

After adding the environment variable:

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic deployment

---

## 🔧 Update Backend CORS for Vercel

After your frontend is deployed, update the backend to allow requests from Vercel:

### Via Render Dashboard:

1. Go to: **https://dashboard.render.com**
2. Select your backend service: **`aitrendpromt`**
3. Go to **"Environment"** tab
4. Add environment variable:
   ```
   ALLOWED_ORIGINS=https://aitrendpromt.vercel.app
   ```
5. Render will auto-redeploy

---

## ✅ Verification Checklist

- [ ] Environment variable `NEXT_PUBLIC_API_URL` added in Vercel
- [ ] Frontend redeployed after adding environment variable
- [ ] Backend CORS updated with Vercel URL
- [ ] Test frontend: `https://aitrendpromt.vercel.app`
- [ ] Check browser console for API calls
- [ ] Verify data loads from backend

---

## 🎯 Quick Fix

If you just need to trigger a new deployment:

```bash
# Make a small change and push
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

This will trigger a new deployment with the latest code.

---

## 📝 Current Status

- ✅ Frontend: Deployed on Vercel
- ⚠️ Action Needed: Add `NEXT_PUBLIC_API_URL` environment variable
- ⚠️ Action Needed: Update backend CORS with Vercel URL

