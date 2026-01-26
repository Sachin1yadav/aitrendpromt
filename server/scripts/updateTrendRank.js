const mongoose = require('mongoose');
require('dotenv').config();

const Prompt = require('../models/Prompt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aitrendpromt';

async function updateTrendRanks() {
  try {
    console.log('🌱 Starting trendRank update...');
    
    // Connect to MongoDB
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}`);

    // Get all prompts
    const prompts = await Prompt.find({});
    console.log(`📄 Found ${prompts.length} prompts`);

    if (prompts.length === 0) {
      console.log('ℹ️  No prompts to update');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Update prompts that don't have trendRank or have it as undefined/null
    let updated = 0;
    let skipped = 0;

    for (const prompt of prompts) {
      // If trendRank is undefined, null, or not set, set it to 0
      if (prompt.trendRank === undefined || prompt.trendRank === null) {
        prompt.trendRank = 0;
        await prompt.save();
        updated++;
        console.log(`   ✓ Updated "${prompt.title}" - Set trendRank to 0`);
      } else {
        skipped++;
      }
    }

    console.log(`\n✅ Update complete!`);
    console.log(`   Updated: ${updated} prompts`);
    console.log(`   Skipped: ${skipped} prompts (already had trendRank)`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating trendRank:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

updateTrendRanks();

