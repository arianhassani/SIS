import mongoose from 'mongoose';

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb+srv://anthonytrannguyen1:iEP1HU8Fj9OpdVcM@cluster0.wex0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };

  export default connectDB;