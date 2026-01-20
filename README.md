# AItrendpromt

Simple Next.js app to showcase AI image prompt trends with before/after examples.

## Features

- Browse prompts by category (Trending, New, Archive)
- Search prompts
- View before/after image comparisons
- See AI model ratings (ChatGPT, Gemini, Midjourney, Leonardo)
- Copy prompts with one click

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- Static JSON data

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── page.jsx              # Home page
│   ├── layout.jsx            # Root layout
│   └── trend/[slug]/page.jsx # Detail pages
├── components/               # React components
├── data/
│   └── prompts.json          # Hardcoded prompt data
└── lib/
    └── prompts.js            # Data utilities
```

## Adding Prompts

Edit `data/prompts.json` and add new prompt objects:

```json
{
  "slug": "unique-slug",
  "title": "Prompt Title",
  "description": "Description",
  "bestModel": "ChatGPT",
  "modelRatings": {
    "chatgpt": "best",
    "gemini": "good",
    "midjourney": "average",
    "leonardo": "not_recommended"
  },
  "prompt": "Full prompt text...",
  "beforeImage": "/path/to/before.jpg",
  "afterImage": "/path/to/after.jpg",
  "tags": ["tag1", "tag2"],
  "category": "trending",
  "createdAt": "2024-01-20"
}
```

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Deploy (auto-detects Next.js)

---

Simple, clean, and fast. No backend needed.
