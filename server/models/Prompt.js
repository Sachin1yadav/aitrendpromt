const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  bestModel: {
    type: String,
    required: true,
    enum: ['ChatGPT', 'Gemini', 'Midjourney', 'Leonardo']
  },
  modelRatings: {
    chatgpt: {
      type: String,
      enum: ['best', 'good', 'average', 'not_recommended'],
      default: 'average'
    },
    gemini: {
      type: String,
      enum: ['best', 'good', 'average', 'not_recommended'],
      default: 'average'
    },
    midjourney: {
      type: String,
      enum: ['best', 'good', 'average', 'not_recommended'],
      default: 'average'
    },
    leonardo: {
      type: String,
      enum: ['best', 'good', 'average', 'not_recommended'],
      default: 'average'
    }
  },
  prompt: {
    type: String,
    required: true,
    trim: true
  },
  beforeImage: {
    type: String,
    required: true
  },
  afterImage: {
    type: String,
    required: true
  },
  exampleImages: {
    type: [String],
    default: []
  },
  imgshoulduse: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['trending', 'new', 'archive'],
    default: 'new'
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  filters: {
    primaryCategory: {
      type: String,
      enum: ['boy', 'girl', 'baby', 'man', 'woman', 'with-god', 'couple', 'family', 'pet', 'cartoon-anime', null],
      default: null
    },
    style: {
      type: [String],
      default: []
    },
    pose: {
      type: [String],
      default: []
    },
    background: {
      type: [String],
      default: []
    },
    god: {
      type: String,
      enum: ['krishna', 'ram', 'shiva', 'hanuman', 'jesus', 'buddha', 'sai-baba', null],
      default: null
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
promptSchema.index({ slug: 1 });
promptSchema.index({ category: 1 });
promptSchema.index({ 'filters.primaryCategory': 1 });

module.exports = mongoose.model('Prompt', promptSchema);

