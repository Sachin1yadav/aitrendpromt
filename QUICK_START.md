# Quick Start Guide - Complete Setup

## ✅ What You Have Already
- ✅ Backend code (Express + Node.js)
- ✅ Frontend code (Next.js)
- ✅ Admin panel
- ✅ All dependencies installed

## ⚠️ What You Need Now

### 1. MongoDB Database Connection

You need to get a MongoDB connection string. Choose one:

**Option A: MongoDB Atlas (Cloud - Recommended)**
- Free account: https://www.mongodb.com/cloud/atlas/register
- Get connection string from Atlas dashboard
- No installation needed

**Option B: Local MongoDB**
- Install MongoDB on your computer
- Use: `mongodb://localhost:27017/aitrendpromt`

---

## 🚀 Complete Setup Steps

### Step 1: Get MongoDB Connection String

**For MongoDB Atlas (Recommended):**
1. Sign up at: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0 - Free tier)
3. Create database user (username + password)
4. Whitelist IP (use `0.0.0.0/0` for development)
5. Get connection string from "Connect" button
6. Format: `mongodb+srv://username:password@cluster.mongodb.net/aitrendpromt`

**For Local MongoDB:**
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/aitrendpromt`

### Step 2: Update .env File

Open `.env` file and update `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/aitrendpromt?retryWrites=true&w=majority
PORT=5000
ADMIN_SECRET=aitrendpromt-secret-2024
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Seed Database (First Time Only)

```bash
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
📄 Loaded 27 prompts from JSON
✅ Successfully seeded 27 prompts
```

### Step 4: Start Backend Server

```bash
npm run dev:server
```

Expected output:
```
✅ Connected to MongoDB
   Database: aitrendpromt
🚀 Server started successfully
   API: http://localhost:5000
```

### Step 5: Start Frontend (New Terminal)

```bash
npm run dev
```

Or run both together:
```bash
npm run dev:all
```

### Step 6: Test Everything

1. **Backend Health Check:**
   - Open: http://localhost:5000/api/health
   - Should show: `{"status":"ok","message":"Server is running"}`

2. **Frontend:**
   - Open: http://localhost:3000
   - Should show prompts from database

3. **Admin Panel:**
   - Open: http://localhost:3000/admin
   - Login with: `aitrendpromt-secret-2024`
   - Create/edit/delete prompts

---

## 📋 Checklist

- [ ] MongoDB connection string obtained
- [ ] `.env` file updated with `MONGODB_URI`
- [ ] Database seeded (`npm run seed`)
- [ ] Backend running (`npm run dev:server`)
- [ ] Frontend running (`npm run dev`)
- [ ] Health check works (http://localhost:5000/api/health)
- [ ] Frontend shows prompts (http://localhost:3000)
- [ ] Admin panel works (http://localhost:3000/admin)

---

## 🎯 That's It!

Once you have MongoDB set up, everything else is ready to go!

**Need help?** Check `MONGODB_SETUP.md` for detailed MongoDB setup instructions.

