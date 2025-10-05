require('dotenv').config({ path: './.env.local' });
const mongoose = require('mongoose');

async function updateModel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update the model with demo-user-id to use actual user ID
    const result = await mongoose.connection.db.collection('models').updateOne(
      { userId: 'demo-user-id' },
      { 
        $set: { 
          userId: '68e262a8b9d8ac9709e34f4e',
          userName: 'Madhan'
        } 
      }
    );

    console.log('Update result:', result);
    console.log('✅ Model updated successfully!');
    
    // Show updated model
    const updatedModel = await mongoose.connection.db.collection('models').findOne({ 
      _id: new mongoose.Types.ObjectId('68e27031965357e78041187d') 
    });
    console.log('Updated model:', JSON.stringify(updatedModel, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

updateModel();
