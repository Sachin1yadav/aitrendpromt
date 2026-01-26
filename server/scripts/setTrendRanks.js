const mongoose = require('mongoose');
require('dotenv').config();

const Prompt = require('../models/Prompt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aitrendpromt';

// Configuration: Set default ranks for each category
const CATEGORY_RANKS = {
  'trending': 500,    // High priority for trending
  'new': 200,         // Medium-high priority for new
  'archive': 50       // Lower priority for archive
};

async function setTrendRanks() {
  try {
    console.log('🌱 Starting trendRank assignment...');
    console.log('📋 Category Ranks Configuration:');
    console.log(`   Trending: ${CATEGORY_RANKS.trending}`);
    console.log(`   New: ${CATEGORY_RANKS.new}`);
    console.log(`   Archive: ${CATEGORY_RANKS.archive}`);
    console.log('');
    
    // Connect to MongoDB
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}\n`);

    // Get all prompts
    const prompts = await Prompt.find({});
    console.log(`📄 Found ${prompts.length} prompts\n`);

    if (prompts.length === 0) {
      console.log('ℹ️  No prompts to update');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Count prompts by category
    const categoryCounts = {
      trending: 0,
      new: 0,
      archive: 0,
      other: 0
    };

    // Update prompts based on category
    let updated = 0;
    let unchanged = 0;

    for (const prompt of prompts) {
      const category = prompt.category || 'new';
      let newRank = CATEGORY_RANKS[category] || 0;
      
      // Only update if the rank is different
      if (prompt.trendRank !== newRank) {
        prompt.trendRank = newRank;
        await prompt.save();
        updated++;
        console.log(`   ✓ Updated "${prompt.title}" (${category}) → Rank: ${newRank}`);
      } else {
        unchanged++;
      }
      
      // Count by category
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        categoryCounts.other++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated} prompts`);
    console.log(`   Unchanged: ${unchanged} prompts (already had correct rank)`);
    console.log(`\n📈 Prompts by Category:`);
    console.log(`   Trending: ${categoryCounts.trending} prompts (Rank: ${CATEGORY_RANKS.trending})`);
    console.log(`   New: ${categoryCounts.new} prompts (Rank: ${CATEGORY_RANKS.new})`);
    console.log(`   Archive: ${categoryCounts.archive} prompts (Rank: ${CATEGORY_RANKS.archive})`);
    if (categoryCounts.other > 0) {
      console.log(`   Other: ${categoryCounts.other} prompts (Rank: 0)`);
    }

    console.log(`\n✅ Update complete!`);
    console.log(`\n💡 Tip: You can still manually adjust individual prompt ranks in the admin panel.`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting trendRank:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

setTrendRanks();

