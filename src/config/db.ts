import mongoose, { ConnectOptions } from 'mongoose';

/**
 * Connects to the MongoDB database using the URI provided in environment variables.
 * Logs a success message if the connection is established, otherwise logs an error.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;