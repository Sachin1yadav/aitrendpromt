# AItrendpromt

A dynamic AI prompt showcase website with admin panel for managing prompts. Built with Next.js, Express, and MongoDB.

## Features

- 🎨 Browse AI prompt trends with before/after examples
- 🔍 Search and filter prompts by category, style, pose, background
- 📱 Mobile-first responsive design
- 🔐 Admin panel for dynamic prompt management
- 🚀 SEO-friendly with static generation
- 📥 Download images functionality
- 🎯 AI model ratings (ChatGPT, Gemini, Midjourney, Leonardo)

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- Lucide React (Icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- RESTful API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd promt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/aitrendpromt
   PORT=5000
   ADMIN_SECRET=aitrendpromt-secret-2024
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aitrendpromt
   ```

4. **Seed the database** (optional - migrates existing JSON data)
   ```bash
   npm run seed
   ```

5. **Start the development servers**

   Option 1: Run both frontend and backend together
   ```bash
   npm run dev:all
   ```

   Option 2: Run separately
   ```bash
   # Terminal 1 - Backend
   npm run dev:server

   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel page
│   ├── trend/[slug]/      # Prompt detail pages
│   └── page.jsx           # Home page
├── components/            # React components
├── lib/                  # Utilities
│   ├── api.js            # API client functions
│   ├── prompts.js        # Prompt utilities
│   └── filters.js        # Filter logic
├── server/               # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── scripts/          # Database scripts
└── data/                 # Static JSON data (for seeding)
```

## API Endpoints

### Public Endpoints

- `GET /api/prompts` - Get all prompts (with optional filters)
- `GET /api/prompts/:slug` - Get prompt by slug
- `GET /api/prompts/slugs/all` - Get all slugs for static generation
- `GET /api/health` - Health check

### Admin Endpoints (Requires Authorization)

- `GET /api/admin/prompts` - Get all prompts (admin view)
- `POST /api/admin/prompts` - Create new prompt
- `PUT /api/admin/prompts/:slug` - Update prompt
- `DELETE /api/admin/prompts/:slug` - Delete prompt

**Authorization Header:**
```
Authorization: Bearer <ADMIN_SECRET>
```

## Admin Panel

1. Navigate to `/admin`
2. Enter your admin secret (set in `.env` as `ADMIN_SECRET`)
3. Create, edit, or delete prompts dynamically
4. No deployment needed - changes are saved to MongoDB instantly

## Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
4. Deploy

### Backend Deployment

Deploy to platforms like:
- Railway
- Render
- Heroku
- DigitalOcean
- AWS EC2

Set environment variables:
- `MONGODB_URI`
- `PORT`
- `ADMIN_SECRET`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/aitrendpromt` |
| `PORT` | Backend server port | `5000` |
| `ADMIN_SECRET` | Secret for admin API access | `aitrendpromt-secret-2024` |
| `NEXT_PUBLIC_API_URL` | Backend API URL for frontend | `http://localhost:5000` |

## Scripts

- `npm run dev` - Start Next.js dev server
- `npm run dev:server` - Start Express backend
- `npm run dev:all` - Start both servers concurrently
- `npm run build` - Build Next.js for production
- `npm start` - Start Next.js production server
- `npm run seed` - Seed database from JSON file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

---

Built with ❤️ for AI creators
