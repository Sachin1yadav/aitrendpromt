# 🚀 Deploy Frontend to Vercel

## ✅ Pre-Deployment Checklist

- [x] Backend deployed on Render: `https://aitrendpromt.onrender.com`
- [x] Frontend configured to use deployed backend URL
- [x] All code committed and pushed to GitHub

---

## 📋 Step-by-Step Vercel Deployment

### Step 1: Sign Up / Login to Vercel

1. Go to: **https://vercel.com**
2. Sign up or login with your **GitHub account** (recommended)

### Step 2: Import Your Repository

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Select your repository: **`Sachin1yadav/aitrendpromt`**
4. Click **"Import"**

### Step 3: Configure Project

1. **Project Name**: `aitrendpromt` (or your preferred name)
2. **Framework Preset**: Vercel will auto-detect **Next.js** ✅
3. **Root Directory**: Leave as `.` (root)
4. **Build Command**: Leave default (Vercel auto-detects)
5. **Output Directory**: Leave default (`.next`)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL=https://aitrendpromt.onrender.com
```

**Important**: 
- Variable name must be exactly: `NEXT_PUBLIC_API_URL`
- Value must be: `https://aitrendpromt.onrender.com`
- Make sure it's added for **Production**, **Preview**, and **Development** environments

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. Vercel will provide your live URL (e.g., `https://aitrendpromt.vercel.app`)

---

## 🔧 Step 6: Update Backend CORS

After getting your Vercel URL, update the backend to allow requests from Vercel:

### Option A: Via Render Dashboard (Recommended)

1. Go to: **https://dashboard.render.com**
2. Select your backend service: **`aitrendpromt`**
3. Go to **"Environment"** tab
4. Add environment variable:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
   (Replace with your actual Vercel URL)
5. Render will auto-redeploy

### Option B: Via Code (Alternative)

Update `server/index.js` to include your Vercel URL in the default origins, then push to GitHub.

---

## ✅ Verification

After deployment:

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Check browser console** (F12) for any errors
3. **Test API calls**: Data should load from `https://aitrendpromt.onrender.com`
4. **Test admin panel**: `https://your-app.vercel.app/admin`

---

## 🎯 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://aitrendpromt.onrender.com`
- **Admin Panel**: `https://your-app.vercel.app/admin`

---

## 🔧 Troubleshooting

### Build Fails

- Check Vercel build logs
- Ensure `package.json` is valid
- Verify all dependencies are listed

### CORS Errors

- Make sure `ALLOWED_ORIGINS` includes your Vercel URL in Render
- Wait for Render to finish redeploying
- Clear browser cache

### Data Not Loading

- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check backend is running: `https://aitrendpromt.onrender.com/api/health`
- Check browser Network tab for failed requests

---

## 📝 Quick Reference

**Vercel Environment Variable:**
```
NEXT_PUBLIC_API_URL=https://aitrendpromt.onrender.com
```

**Render Environment Variable (after Vercel deploy):**
```
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

---

## 🎉 You're Live!

Once deployed, your app will be accessible worldwide! 🚀

