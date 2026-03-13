const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    console.log('MongoDB URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    const testCollection = mongoose.connection.db.collection('cateogries');
    await testCollection.insertOne({ message: 'Database created!' }).catch(err => {
      console.log('Error inserting dummy document:', err);
    });

    await testCollection.deleteOne({ message: 'Database created!' }).catch(err => {
      console.log('Error deleting dummy document:', err);
    });

  } catch (err) {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;