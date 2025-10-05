require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');

async function removeUserNameField() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Remove userName field from all models
    const result = await mongoose.connection.db.collection('models').updateMany(
      {},
      { $unset: { userName: "" } }
    );

    console.log(`✓ Updated ${result.modifiedCount} model(s)`);
    console.log('✓ userName field removed successfully!');
    
    // Show updated models
    const models = await mongoose.connection.db.collection('models').find({}).toArray();
    console.log('\nUpdated models:');
    models.forEach(model => {
      console.log(`- ${model.title}: userId = ${model.userId}, userName = ${model.userName || 'REMOVED'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Connection closed');
  }
}

removeUserNameField();
