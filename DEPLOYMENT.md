# Deployment Guide - Frontend & Backend

## 🚀 Deployment Strategy

- **Frontend (Next.js)**: Vercel (Free tier)
- **Backend (Express)**: Railway or Render (Free tier)
- **Database**: MongoDB Atlas (Already set up - Free tier)

---

## 📋 Step 1: Deploy Backend (Express API)

### Option A: Railway (Recommended - Easiest)

1. **Sign up at Railway**
   - Go to: https://railway.app
   - Sign up with GitHub (free tier available)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select your repository

3. **Configure Deployment**
   - Railway will auto-detect Node.js
   - Add environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     PORT=5000
     ADMIN_SECRET=your_secure_admin_secret
     NODE_ENV=production
     ```
   - Set start command: `node server/index.js`

4. **Deploy**
   - Railway will automatically deploy
   - Get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render (Alternative)

1. **Sign up at Render**
   - Go to: https://render.com
   - Sign up (free tier available)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `aitrendpromt-backend`
     - **Environment**: Node
     - **Build Command**: (leave empty or `npm install`)
     - **Start Command**: `node server/index.js`
     - **Plan**: Free

3. **Add Environment Variables**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   ADMIN_SECRET=your_secure_admin_secret
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will deploy automatically
   - Get your backend URL (e.g., `https://aitrendpromt-backend.onrender.com`)

---

## 📋 Step 2: Update Backend CORS

After deploying backend, update CORS to allow your Vercel domain.

### Update `server/index.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

Or for production, use environment variable:

```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

---

## 📋 Step 3: Deploy Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to: https://vercel.com
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./` (root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
   Or if using Render:
   ```
   NEXT_PUBLIC_API_URL=https://aitrendpromt-backend.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Get your frontend URL (e.g., `https://aitrendpromt.vercel.app`)

---

## 📋 Step 4: Update MongoDB Atlas Network Access

1. **Go to MongoDB Atlas**
   - Login to your Atlas account
   - Go to "Network Access"

2. **Add IP Address**
   - Click "Add IP Address"
   - For production, you can:
     - Add specific IPs (Railway/Render IPs)
     - Or use `0.0.0.0/0` (allows all - for development/testing)
   - Click "Confirm"

---

## 📋 Step 5: Update Backend CORS (Production)

After getting your Vercel URL, update backend CORS:

1. **Go to Railway/Render dashboard**
2. **Add environment variable**:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
   ```
3. **Redeploy backend**

Or update `server/index.js` directly with your Vercel URL.

---

## ✅ Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Backend health check works: `https://your-backend.railway.app/api/health`
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variable `NEXT_PUBLIC_API_URL` set
- [ ] MongoDB Atlas network access configured
- [ ] CORS updated to allow Vercel domain
- [ ] Test API from frontend
- [ ] Test admin panel

---

## 🔧 Troubleshooting

### Backend not connecting to MongoDB
- Check `MONGODB_URI` in environment variables
- Verify MongoDB Atlas network access includes backend IP
- Check backend logs for connection errors

### CORS errors
- Update `ALLOWED_ORIGINS` with your Vercel URL
- Check backend CORS configuration
- Verify frontend `NEXT_PUBLIC_API_URL` is correct

### Frontend not loading data
- Check browser console for errors
- Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Test backend API directly
- Check network tab for failed requests

---

## 📝 Environment Variables Summary

### Backend (Railway/Render):
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aitrendpromt
PORT=5000
ADMIN_SECRET=your-secure-secret-here
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 🎯 Quick Deploy Commands

### Railway CLI (Optional):
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Vercel CLI (Optional):
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 💡 Pro Tips

1. **Use Railway** for backend - easiest setup
2. **Keep MongoDB Atlas** - already free and working
3. **Test locally first** with production URLs
4. **Use environment variables** - never hardcode URLs
5. **Monitor logs** - Railway and Vercel provide logs
6. **Set up custom domain** (optional) - for better branding

---

Your app will be live and accessible worldwide! 🌍

