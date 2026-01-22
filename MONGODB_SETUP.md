# MongoDB Setup Guide

## What's Remaining?

You need to set up **MongoDB** - the database where all your prompts will be stored.

## Two Options:

### Option 1: MongoDB Atlas (Cloud - RECOMMENDED) ⭐
- **Free tier available**
- No installation needed
- Works from anywhere
- Easy to set up

### Option 2: Local MongoDB
- Install MongoDB on your computer
- Runs locally
- Good for development

---

## 🚀 Option 1: MongoDB Atlas (Cloud) - RECOMMENDED

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (it's free!)
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster
1. After signup, click **"Build a Database"**
2. Choose **FREE** (M0) tier
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to you
5. Click **"Create"** (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username (e.g., `aitrendpromt_user`)
5. Enter password (save it securely!)
6. Set privileges to **"Atlas Admin"**
7. Click **"Add User"**

### Step 4: Whitelist Your IP
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - ⚠️ For production, use specific IPs only
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add database name at the end:
   ```
   mongodb+srv://aitrendpromt_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aitrendpromt?retryWrites=true&w=majority
   ```

### Step 6: Update .env File
Open your `.env` file and update:
```env
MONGODB_URI=mongodb+srv://aitrendpromt_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aitrendpromt?retryWrites=true&w=majority
```

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/aitrendpromt?retryWrites=true&w=majority
```

---

## 💻 Option 2: Local MongoDB

### Step 1: Install MongoDB
**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Complete" installation
4. Install as Windows Service (recommended)
5. Install MongoDB Compass (GUI tool - optional but helpful)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Step 2: Verify Installation
```bash
mongod --version
```

### Step 3: Start MongoDB
**Windows:**
- MongoDB should start automatically as a service
- Or run: `net start MongoDB`

**macOS/Linux:**
```bash
brew services start mongodb-community  # macOS
# or
sudo systemctl start mongodb  # Linux
```

### Step 4: Update .env File
```env
MONGODB_URI=mongodb://localhost:27017/aitrendpromt
```

---

## ✅ After Setup - Test Connection

### 1. Update .env file with your MongoDB URI

### 2. Seed the database (first time only):
```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
📄 Loaded 27 prompts from JSON
🗑️  Cleared 0 existing prompts
✅ Successfully seeded 27 prompts
```

### 3. Start the backend:
```bash
npm run dev:server
```

You should see:
```
✅ Connected to MongoDB
   Database: aitrendpromt
   Host: cluster0.xxxxx.mongodb.net
🚀 Server started successfully
   API: http://localhost:5000
```

### 4. Test the API:
```bash
# Health check
curl http://localhost:5000/api/health

# Get all prompts
curl http://localhost:5000/api/prompts
```

---

## 🔍 Troubleshooting

### Connection Failed?
1. **Check MongoDB URI format:**
   - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database`
   - Local: `mongodb://localhost:27017/database`

2. **Check credentials:**
   - Username and password are correct
   - Special characters in password are URL-encoded (%40 for @, etc.)

3. **Check IP whitelist (Atlas):**
   - Your IP is whitelisted
   - Or use `0.0.0.0/0` for development

4. **Check MongoDB is running (Local):**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   brew services list  # macOS
   sudo systemctl status mongodb  # Linux
   ```

### Still Having Issues?
- Check MongoDB logs
- Verify firewall settings
- Test connection string in MongoDB Compass
- Check `.env` file is in root directory

---

## 📝 Quick Reference

**MongoDB Atlas Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Local MongoDB Connection String:**
```
mongodb://localhost:27017/<database>
```

**Your .env should have:**
```env
MONGODB_URI=your_connection_string_here
PORT=5000
ADMIN_SECRET=aitrendpromt-secret-2024
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🎯 Recommended: Use MongoDB Atlas

**Why?**
- ✅ Free tier (512MB storage - enough for thousands of prompts)
- ✅ No installation needed
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Easy to scale later
- ✅ Works on any device

**Free Tier Limits:**
- 512MB storage
- Shared RAM
- Perfect for development and small projects

---

Once you have MongoDB set up, you're ready to go! 🚀

