# Render Deployment Guide - Ready to Deploy! ✅

## ✅ Your Setup is Ready for Render!

All configuration files are in place:
- ✅ `render.yaml` - Render configuration
- ✅ `Procfile` - Start command
- ✅ `server/index.js` - Backend server
- ✅ All dependencies in `package.json`

---

## 🚀 Deploy to Render (5 Minutes)

### Step 1: Sign Up / Login
1. Go to: https://render.com
2. Sign up with GitHub (free tier available)

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository: `aitrendpromt` (or your repo name)

### Step 3: Configure Service
Render will auto-detect `render.yaml`, but you can also configure manually:

**Basic Settings:**
- **Name**: `aitrendpromt-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `./` (root)

**Build & Deploy:**
- **Build Command**: `npm install --production` (or leave empty - Render will auto-detect)
- **Start Command**: `node server/index.js`
- **Plan**: `Free`

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**:

```
MONGODB_URI=mongodb+srv://sy9084087_db_user:rvJ4R4t1nLC60dJw@cluster0.ldgjfft.mongodb.net/aitrendpromt?retryWrites=true&w=majority
NODE_ENV=production
ADMIN_SECRET=aitrendpromt-secret-2024
```

**Note**: `PORT` is automatically set by Render - don't add it manually.

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Render will:
   - Install dependencies
   - Start your server
   - Give you a URL like: `https://aitrendpromt-backend.onrender.com`

---

## ✅ Verification

After deployment, test your backend:

```bash
curl https://aitrendpromt-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected",
  "timestamp": "...",
  "uptime": ...
}
```

---

## 🔧 If Using render.yaml (Auto-Config)

If you push `render.yaml` to your repo, Render will:
- Auto-detect the configuration
- Use the settings from `render.yaml`
- You just need to add environment variables manually

**To use render.yaml:**
1. Make sure `render.yaml` is in your repo root
2. When creating service, Render will ask: "Apply render.yaml?"
3. Click **"Yes"**
4. Add environment variables
5. Deploy

---

## 📝 Important Notes

### Port Configuration
- Render automatically sets `PORT` environment variable
- Your `server/index.js` uses: `process.env.PORT || 5000`
- This will work automatically ✅

### MongoDB Atlas
- Make sure MongoDB Atlas allows connections from Render
- Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` (allows all IPs) OR add Render's IP ranges

### Free Tier Limits
- Render free tier: Service sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Perfect for development/testing
- For production, consider paid plan ($7/month)

---

## 🎯 Next Steps After Backend Deployment

1. **Get your backend URL**: `https://aitrendpromt-backend.onrender.com`
2. **Deploy frontend to Vercel**:
   - Add environment variable: `NEXT_PUBLIC_API_URL=https://aitrendpromt-backend.onrender.com`
3. **Update backend CORS**:
   - Add environment variable: `ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`
   - Redeploy backend

---

## ✅ Everything is Ready!

Your backend is configured correctly for Render. Just:
1. Push code to GitHub
2. Connect to Render
3. Add environment variables
4. Deploy!

It will work! 🚀

