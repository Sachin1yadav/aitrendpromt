const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Prompt = require('../models/Prompt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aitrendpromt';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}`);

    // Read JSON data (optional - only if file exists)
    const jsonPath = path.join(__dirname, '../../data/prompts.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.log('ℹ️  prompts.json not found. Data is now managed through MongoDB and Admin Panel.');
      console.log('   Use the admin panel at /admin to add prompts dynamically.');
      console.log('   Or restore prompts.json if you need to re-seed the database.');
      process.exit(0);
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`📄 Loaded ${jsonData.length} prompts from JSON`);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      throw new Error('JSON file is empty or invalid');
    }

    // Clear existing data (optional - comment out if you want to keep existing)
    const deleteResult = await Prompt.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing prompts`);

    // Validate and prepare data
    const validPrompts = [];
    const errors = [];
    
    for (let i = 0; i < jsonData.length; i++) {
      try {
        // Ensure slug is lowercase
        if (jsonData[i].slug) {
          jsonData[i].slug = jsonData[i].slug.toLowerCase().trim();
        }
        
        // Create a new document to validate
        const prompt = new Prompt(jsonData[i]);
        await prompt.validate();
        validPrompts.push(jsonData[i]);
      } catch (error) {
        errors.push({
          index: i,
          slug: jsonData[i]?.slug || 'unknown',
          error: error.message
        });
      }
    }

    if (errors.length > 0) {
      console.warn(`⚠️  Found ${errors.length} invalid prompts:`);
      errors.forEach(err => {
        console.warn(`   - ${err.slug}: ${err.error}`);
      });
    }

    if (validPrompts.length === 0) {
      throw new Error('No valid prompts to insert');
    }

    // Insert prompts in batches to avoid memory issues
    const batchSize = 10;
    let inserted = 0;
    
    for (let i = 0; i < validPrompts.length; i += batchSize) {
      const batch = validPrompts.slice(i, i + batchSize);
      await Prompt.insertMany(batch, { ordered: false });
      inserted += batch.length;
      console.log(`   Inserted ${inserted}/${validPrompts.length} prompts...`);
    }

    console.log(`✅ Successfully seeded ${inserted} prompts`);
    if (errors.length > 0) {
      console.log(`⚠️  Skipped ${errors.length} invalid prompts`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

seedDatabase();

