const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Event type: page_view, prompt_click, button_click, instagram_click, etc.
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'prompt_click', 'button_click', 'instagram_click', 'search', 'filter_apply', 'copy_prompt', 'download_image']
  },
  
  // Page/Route information
  page: {
    type: String,
    required: true
  },
  
  // Referrer information
  referrer: {
    type: String,
    default: null
  },
  
  // User agent
  userAgent: {
    type: String,
    default: null
  },
  
  // IP address (for basic location tracking)
  ipAddress: {
    type: String,
    default: null
  },
  
  // Event-specific data
  eventData: {
    // For prompt clicks
    promptSlug: String,
    promptTitle: String,
    promptCategory: String,
    
    // For button clicks
    buttonName: String,
    buttonLocation: String,
    
    // For Instagram clicks
    instagramLocation: String, // header, cta, footer, etc.
    
    // For search
    searchQuery: String,
    
    // For filters
    filterType: String,
    filterValue: String,
    
    // For copy/download
    actionType: String,
    resourceType: String
  },
  
  // Session ID (to track user sessions)
  sessionId: {
    type: String,
    default: null,
    index: true
  },
  
  // Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ page: 1, timestamp: -1 });
analyticsSchema.index({ 'eventData.promptSlug': 1 });
analyticsSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);

