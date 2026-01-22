# Backend Implementation Guide

## ✅ Complete Backend Structure

```
server/
├── index.js                 # Main Express server
├── config/
│   └── database.js         # MongoDB connection config
├── models/
│   └── Prompt.js            # MongoDB schema/model
├── routes/
│   ├── prompts.js          # Public API routes
│   └── admin.js            # Admin API routes (protected)
├── middleware/
│   ├── errorHandler.js     # Global error handler
│   └── notFound.js         # 404 handler
└── scripts/
    └── seed.js             # Database seeding script
```

## 🚀 Features Implemented

### 1. **Robust MongoDB Connection**
- Connection pooling (min: 5, max: 10)
- Automatic reconnection handling
- Connection event listeners
- Graceful shutdown handling
- Timeout configurations

### 2. **Error Handling**
- Global error handler middleware
- Proper HTTP status codes
- Detailed error messages in development
- Validation error handling
- Duplicate key error handling

### 3. **API Routes**

#### Public Routes (`/api/prompts`)
- `GET /api/prompts` - Get all prompts with filters
- `GET /api/prompts/:slug` - Get prompt by slug
- `GET /api/prompts/slugs/all` - Get all slugs for SSG

#### Admin Routes (`/api/admin`) - Protected
- `GET /api/admin/prompts` - List all prompts
- `POST /api/admin/prompts` - Create new prompt
- `PUT /api/admin/prompts/:slug` - Update prompt
- `DELETE /api/admin/prompts/:slug` - Delete prompt

### 4. **Security**
- Admin authentication via Bearer token
- Input validation
- Slug normalization (lowercase)
- Required field validation

### 5. **Performance**
- Database query optimization
- `.lean()` for faster queries
- Indexed fields (slug, category, primaryCategory)
- Batch operations in seeding

### 6. **Logging**
- Request logging
- Error logging
- Connection status logging
- Detailed seeding progress

## 📋 Environment Variables

Create `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/aitrendpromt
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aitrendpromt

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Authentication
ADMIN_SECRET=aitrendpromt-secret-2024

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🛠️ Usage

### Start Backend Server
```bash
npm run dev:server
```

### Seed Database
```bash
npm run seed
```

### Test API
```bash
# Health check
curl http://localhost:5000/api/health

# Get all prompts
curl http://localhost:5000/api/prompts

# Get prompt by slug
curl http://localhost:5000/api/prompts/ghibli-saree
```

## 🔒 Admin API Usage

All admin endpoints require authentication:

```bash
# Create prompt
curl -X POST http://localhost:5000/api/admin/prompts \
  -H "Authorization: Bearer aitrendpromt-secret-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Prompt",
    "description": "Test description",
    "prompt": "Test prompt text",
    "bestModel": "ChatGPT",
    "beforeImage": "https://example.com/before.jpg",
    "afterImage": "https://example.com/after.jpg"
  }'
```

## 📊 Database Schema

The Prompt model includes:
- Basic fields (slug, title, description, prompt)
- Images (beforeImage, afterImage, exampleImages, imgshoulduse)
- Model ratings (ChatGPT, Gemini, Midjourney, Leonardo)
- Filters (primaryCategory, style, pose, background, god)
- Metadata (tags, category, createdAt)

## ✅ Production Ready

- ✅ Error handling
- ✅ Input validation
- ✅ Security (admin auth)
- ✅ Connection pooling
- ✅ Graceful shutdown
- ✅ Logging
- ✅ Environment configuration
- ✅ Database indexes
- ✅ Query optimization

## 🐛 Troubleshooting

### MongoDB Connection Failed
1. Check if MongoDB is running
2. Verify `MONGODB_URI` in `.env`
3. For Atlas: Check IP whitelist and credentials

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Kill process using port: `lsof -ti:5000 | xargs kill`

### Validation Errors
- Check required fields are provided
- Ensure enum values are correct
- Verify data types match schema

