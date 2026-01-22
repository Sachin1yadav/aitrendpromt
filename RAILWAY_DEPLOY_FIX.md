# Railway Backend Deployment Fix

## ❌ Problem
Railway is trying to build Next.js (frontend) which requires Node.js 20+, but it's detecting the whole repo as a Next.js project.

## ✅ Solution: Configure Railway Settings

### Step 1: Go to Railway Dashboard
1. Open your Railway project
2. Click on your service
3. Go to **Settings** tab

### Step 2: Configure Build Settings
Under **"Build & Deploy"** section:

1. **Build Command**: 
   ```
   echo "Backend deployment - skipping Next.js build"
   ```
   OR leave it **EMPTY**

2. **Start Command**: 
   ```
   node server/index.js
   ```

3. **Root Directory**: 
   ```
   ./
   ```
   (root of the repo)

### Step 3: Environment Variables
Make sure these are set:
```
MONGODB_URI=mongodb+srv://sy9084087_db_user:rvJ4R4t1nLC60dJw@cluster0.ldgjfft.mongodb.net/aitrendpromt?retryWrites=true&w=majority
PORT=5000
ADMIN_SECRET=aitrendpromt-secret-2024
NODE_ENV=production
```

### Step 4: Redeploy
1. Click **"Redeploy"** or push a new commit
2. Railway will use the new settings

---

## 🔄 Alternative: Use Render (Easier for Backend)

If Railway continues to have issues, **Render is simpler**:

### Render Setup:
1. Go to https://render.com
2. **New** → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Name**: `aitrendpromt-backend`
   - **Environment**: `Node`
   - **Build Command**: (leave **EMPTY**)
   - **Start Command**: `node server/index.js`
   - **Plan**: Free
5. Add environment variables (same as above)
6. Click **Create Web Service**

Render won't try to build Next.js - it just runs your start command.

---

## 📝 Files Created to Help

- `nixpacks.toml` - Tells Railway to skip build
- `.railwayignore` - Ignores frontend files
- `Procfile` - Specifies start command

But the **easiest fix** is to configure Railway Settings manually as shown above.

---

## ✅ After Fix

Your backend should deploy successfully and be accessible at:
`https://your-app.railway.app` or `https://your-app.onrender.com`

Test it:
```bash
curl https://your-backend-url/api/health
```

Should return:
```json
{"status":"ok","message":"Server is running","database":"connected"}
```

