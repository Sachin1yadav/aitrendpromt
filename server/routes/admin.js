const express = require('express');
const router = express.Router();
const Prompt = require('../models/Prompt');

// Simple admin authentication (you can enhance this later)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'aitrendpromt-secret-2024';

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  
  next();
};

// Apply auth to all admin routes (except analytics stats which should be accessible)
router.use((req, res, next) => {
  // Allow analytics stats without auth for now (you can add auth later if needed)
  if (req.path === '/analytics/stats' || req.path.startsWith('/analytics/')) {
    return next();
  }
  authenticateAdmin(req, res, next);
});

// GET all prompts (admin view)
router.get('/prompts', async (req, res, next) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: prompts.length, data: prompts });
  } catch (error) {
    console.error('Error fetching prompts (admin):', error);
    next(error);
  }
});

// POST create new prompt
router.post('/prompts', async (req, res, next) => {
  try {
    // Validate required fields
    const requiredFields = ['title', 'description', 'prompt', 'beforeImage', 'afterImage', 'bestModel'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Generate slug from title if not provided
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Ensure slug is lowercase
    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase().trim();
    }
    
    // Check if slug already exists
    const existing = await Prompt.findOne({ slug: req.body.slug });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt with this slug already exists' 
      });
    }
    
    const prompt = new Prompt(req.body);
    await prompt.save();
    
    res.status(201).json({ success: true, data: prompt });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry. Slug already exists.'
      });
    }
    console.error('Error creating prompt:', error);
    next(error);
  }
});

// PUT update prompt
router.put('/prompts/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    console.log('=== UPDATE REQUEST START ===');
    console.log('Slug:', slug);
    console.log('req.body.trendRank:', req.body.trendRank, 'type:', typeof req.body.trendRank);
    
    // Find the existing prompt first
    const existingPrompt = await Prompt.findOne({ slug: slug.toLowerCase() });
    if (!existingPrompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    
    console.log('Existing prompt trendRank:', existingPrompt.trendRank);
    
    // Handle trendRank explicitly - parse it correctly
    if (req.body.trendRank !== undefined && req.body.trendRank !== null) {
      const trendRankValue = parseInt(String(req.body.trendRank));
      if (!isNaN(trendRankValue)) {
        const clampedValue = Math.max(0, Math.min(1000, trendRankValue));
        console.log('Setting trendRank to:', clampedValue);
        existingPrompt.trendRank = clampedValue;
      }
    }
    
    // Update other fields
    const fieldsToUpdate = [
      'title', 'description', 'bestModel', 'prompt', 'beforeImage', 'afterImage',
      'exampleImages', 'imgshoulduse', 'tags', 'category', 'modelRatings', 'filters'
    ];
    
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'slug' && req.body[field]) {
          existingPrompt[field] = req.body[field].toLowerCase().trim();
        } else {
          existingPrompt[field] = req.body[field];
        }
      }
    });
    
    // Handle slug separately
    if (req.body.slug) {
      existingPrompt.slug = req.body.slug.toLowerCase().trim();
    }
    
    console.log('Before save - trendRank:', existingPrompt.trendRank);
    
    // Save the document
    await existingPrompt.save();
    
    console.log('After save - trendRank:', existingPrompt.trendRank);
    
    // Fetch fresh from DB to verify
    const verifiedPrompt = await Prompt.findOne({ slug: slug.toLowerCase() }).lean();
    console.log('Verified from DB - trendRank:', verifiedPrompt.trendRank);
    
    res.json({ success: true, data: verifiedPrompt });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        error: errors.join(', ') 
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry. Slug already exists.'
      });
    }
    console.error('Error updating prompt:', error);
    next(error);
  }
});

// DELETE prompt
router.delete('/prompts/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const prompt = await Prompt.findOneAndDelete({ slug: slug.toLowerCase() });
    
    if (!prompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Prompt deleted successfully',
      deletedSlug: slug 
    });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    next(error);
  }
});

module.exports = router;

