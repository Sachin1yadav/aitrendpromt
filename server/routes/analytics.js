const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');

// POST - Track an event
router.post('/track', async (req, res, next) => {
  try {
    const {
      eventType,
      page,
      referrer,
      eventData,
      sessionId
    } = req.body;

    // Validate required fields
    if (!eventType || !page) {
      return res.status(400).json({
        success: false,
        error: 'eventType and page are required'
      });
    }

    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Create analytics record - ensure eventData is properly structured
    const analyticsData = {
      eventType,
      page,
      referrer: referrer || null,
      userAgent,
      ipAddress,
      eventData: eventData || {},
      sessionId: sessionId || null,
      timestamp: new Date()
    };

    // Validate eventType is in enum
    const validEventTypes = ['page_view', 'prompt_click', 'button_click', 'instagram_click', 'search', 'filter_apply', 'copy_prompt', 'download_image'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid eventType: ${eventType}. Must be one of: ${validEventTypes.join(', ')}`
      });
    }

    const analytics = new Analytics(analyticsData);
    
    // Validate before saving
    const validationError = analytics.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validationError.errors
      });
    }

    await analytics.save();

    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    console.error('Error stack:', error.stack);
    // Don't fail the request if tracking fails - return success but log error
    res.status(200).json({
      success: true,
      message: 'Event tracking attempted',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET - Get analytics statistics (Admin only)
router.get('/stats', async (req, res, next) => {
  try {
    const { startDate, endDate, eventType, excludeLocalhost } = req.query;

    // Build query
    const query = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    if (eventType) {
      query.eventType = eventType;
    }
    
    // Filter out localhost traffic if requested
    if (excludeLocalhost === 'true' || excludeLocalhost === '1') {
      // Build a query that excludes localhost in referrer, IP, or page
      // Allow null referrers (direct traffic) but exclude localhost referrers
      query.$and = [
        {
          $or: [
            { referrer: null },
            { referrer: { $not: { $regex: /localhost|127\.0\.0\.1/, $options: 'i' } } }
          ]
        },
        {
          ipAddress: { $not: { $regex: /localhost|127\.0\.0\.1|::1/, $options: 'i' } }
        },
        {
          page: { $not: { $regex: /localhost|127\.0\.0\.1/, $options: 'i' } }
        }
      ];
    }

    // Get total events
    const totalEvents = await Analytics.countDocuments(query);

    // Get events by type
    const eventsByType = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get page views
    const pageViews = await Analytics.aggregate([
      { $match: { ...query, eventType: 'page_view' } },
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get top prompts (by clicks)
    const topPrompts = await Analytics.aggregate([
      { $match: { ...query, eventType: 'prompt_click' } },
      {
        $group: {
          _id: '$eventData.promptSlug',
          title: { $first: '$eventData.promptTitle' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get Instagram clicks
    const instagramClicks = await Analytics.aggregate([
      { $match: { ...query, eventType: 'instagram_click' } },
      {
        $group: {
          _id: '$eventData.instagramLocation',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get referrers
    const topReferrers = await Analytics.aggregate([
      { $match: { ...query, referrer: { $ne: null } } },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get daily stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dailyStats = await Analytics.aggregate([
      {
        $match: {
          ...query,
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalEvents,
        eventsByType,
        pageViews,
        topPrompts,
        instagramClicks,
        topReferrers,
        dailyStats
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET - Get recent events (for admin dashboard)
router.get('/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    const recentEvents = await Analytics.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: recentEvents.length,
      data: recentEvents
    });
  } catch (error) {
    console.error('Error fetching recent events:', error);
    next(error);
  }
});

module.exports = router;

