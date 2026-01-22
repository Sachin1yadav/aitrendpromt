# Setup Guide - AItrendpromt Backend & Frontend

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Default connection: `mongodb://localhost:27017/aitrendpromt`

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `.env` with your Atlas connection string

### 3. Configure Environment Variables

The `.env` file should contain:
```env
MONGODB_URI=mongodb://localhost:27017/aitrendpromt
PORT=5000
ADMIN_SECRET=aitrendpromt-secret-2024
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Seed Database (First Time Only)

This migrates your existing JSON data to MongoDB:
```bash
npm run seed
```

### 5. Start Development Servers

**Option A: Run Both Together**
```bash
npm run dev:all
```

**Option B: Run Separately**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin

## Admin Panel Usage

1. Navigate to http://localhost:3000/admin
2. Enter admin secret (from `.env` file: `ADMIN_SECRET`)
3. Create, edit, or delete prompts
4. Changes are saved instantly to MongoDB
5. No deployment needed - everything is dynamic!

## API Testing

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Get All Prompts
```bash
curl http://localhost:5000/api/prompts
```

### Get Prompt by Slug
```bash
curl http://localhost:5000/api/prompts/ghibli-saree
```

### Create Prompt (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/prompts \
  -H "Authorization: Bearer aitrendpromt-secret-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Prompt",
    "slug": "test-prompt",
    "description": "Test description",
    "bestModel": "ChatGPT",
    "prompt": "Test prompt text",
    "beforeImage": "https://example.com/before.jpg",
    "afterImage": "https://example.com/after.jpg"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For Atlas: Check IP whitelist and credentials

### Port Already in Use
- Change `PORT` in `.env` to a different port (e.g., 5001)
- Update `NEXT_PUBLIC_API_URL` accordingly

### API Not Responding
- Ensure backend server is running (`npm run dev:server`)
- Check backend logs for errors
- Verify `NEXT_PUBLIC_API_URL` matches backend port

### Admin Panel Not Working
- Verify `ADMIN_SECRET` matches in `.env` and admin panel
- Check browser console for errors
- Ensure backend is running

## Production Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL` = your backend URL
4. Deploy

### Backend (Railway/Render/Heroku)
1. Set environment variables:
   - `MONGODB_URI` (your production MongoDB)
   - `PORT` (usually auto-set by platform)
   - `ADMIN_SECRET` (use a strong secret)
2. Deploy
3. Update frontend `NEXT_PUBLIC_API_URL` to backend URL

## Next Steps

- ✅ Backend API is ready
- ✅ Admin panel for dynamic content management
- ✅ Frontend fetches from API
- ✅ SEO-friendly with revalidation
- ✅ No deployment needed for new prompts!

Enjoy your dynamic AI prompt showcase! 🚀

