const express = require('express');
const router = express.Router();
const Prompt = require('../models/Prompt');

// GET all prompts
router.get('/', async (req, res, next) => {
  try {
    const { category, search, primaryCategory, style, pose, background, god } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by primary category
    if (primaryCategory) {
      query['filters.primaryCategory'] = primaryCategory;
    }
    
    // Filter by style
    if (style) {
      query['filters.style'] = { $in: Array.isArray(style) ? style : [style] };
    }
    
    // Filter by pose
    if (pose) {
      query['filters.pose'] = { $in: Array.isArray(pose) ? pose : [pose] };
    }
    
    // Filter by background
    if (background) {
      query['filters.background'] = { $in: Array.isArray(background) ? background : [background] };
    }
    
    // Filter by god
    if (god) {
      query['filters.god'] = god;
    }
    
    // Search in title, description, tags, or prompt
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { prompt: { $regex: search, $options: 'i' } }
      ];
    }
    
    const prompts = await Prompt.find(query).sort({ createdAt: -1 }).lean();
    res.json({ 
      success: true, 
      count: prompts.length, 
      data: prompts 
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    next(error);
  }
});

// GET prompt by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ success: false, error: 'Slug is required' });
    }
    
    const prompt = await Prompt.findOne({ slug: slug.toLowerCase() }).lean();
    
    if (!prompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    
    res.json({ success: true, data: prompt });
  } catch (error) {
    console.error('Error fetching prompt:', error);
    next(error);
  }
});

// GET all slugs (for static generation)
router.get('/slugs/all', async (req, res, next) => {
  try {
    const prompts = await Prompt.find({}, 'slug').sort({ createdAt: -1 }).lean();
    const slugs = prompts.map(p => p.slug);
    res.json({ success: true, count: slugs.length, data: slugs });
  } catch (error) {
    console.error('Error fetching slugs:', error);
    next(error);
  }
});

module.exports = router;

