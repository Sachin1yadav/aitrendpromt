# Quick Deployment Guide

## 🚀 Fastest Way to Deploy (5 Minutes)

### Step 1: Deploy Backend (Railway) - 3 min

1. Go to https://railway.app → Sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://sy9084087_db_user:rvJ4R4t1nLC60dJw@cluster0.ldgjfft.mongodb.net/aitrendpromt?retryWrites=true&w=majority
   PORT=5000
   ADMIN_SECRET=aitrendpromt-secret-2024
   NODE_ENV=production
   ```
5. Railway will auto-deploy
6. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend (Vercel) - 2 min

1. Go to https://vercel.com → Import your GitHub repo
2. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   (Replace with your actual Railway URL)
3. Click "Deploy"
4. Done! Your app is live!

### Step 3: Update Backend CORS

After Vercel deployment, get your Vercel URL and:

1. Go back to Railway dashboard
2. Add environment variable:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
3. Railway will auto-redeploy

---

## ✅ That's It!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- Admin: `https://your-app.vercel.app/admin`

Both are FREE! 🎉

