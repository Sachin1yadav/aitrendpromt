import StructuredData from "@/components/StructuredData";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is AItrendpromt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AItrendpromt is a free platform that helps you discover trending AI image generation prompts. We provide real before/after examples, expert recommendations on which AI tools work best, and comprehensive filtering to find exactly what you need."
      }
    },
    {
      "@type": "Question",
      "name": "Are the AI prompts free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! All prompts, images, and resources on AItrendpromt are completely free to use. No sign-up required, no credit card needed."
      }
    },
    {
      "@type": "Question",
      "name": "Which AI tools work with these prompts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our prompts work with ChatGPT (DALL-E), Google Gemini, Midjourney, and Leonardo AI. Each prompt includes ratings showing which tool works best for that specific prompt."
      }
    },
    {
      "@type": "Question",
      "name": "How do I use an AI prompt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "1. Copy the prompt text from our website. 2. Download and upload the reference images shown. 3. Use the recommended AI model for best results. 4. Paste the prompt into your AI image generator. 5. Generate your amazing images!"
      }
    },
    {
      "@type": "Question",
      "name": "What types of AI prompts are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer prompts for various styles (Ghibli, Pixar, Anime, Realistic, 3D Render, Oil Painting, Watercolor), categories (Boy, Girl, Baby, Man, Woman, Couple, Family, Pet, Cartoon/Anime), scenes (Portrait, Full Body, Cinematic, Festival, Temple, Street, Wedding, Travel), and backgrounds (Indian Temple, Heaven, City, Village, Nature, Studio)."
      }
    },
    {
      "@type": "Question",
      "name": "How often are new prompts added?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "New trending prompts are added regularly. Check the 'New Prompts' section for the latest additions, and follow us on Instagram for daily trending prompts and tutorials."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use the generated images commercially?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The prompts are free to use. However, you should check the terms of service of your chosen AI tool (ChatGPT, Gemini, Midjourney, Leonardo) regarding commercial use of generated images."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to create an account?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No! AItrendpromt is completely free and requires no sign-up. Just visit the website and start browsing, copying, and using prompts immediately."
      }
    }
  ]
};

export default function FAQSchema() {
  return <StructuredData data={faqSchema} />;
}

