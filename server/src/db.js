import { connect } from 'mongoose';
import { config } from 'dotenv';
config();

async function connectDB() {
  try {
    console.log("MONGO_URI =", process.env.MONGO_URI);
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected with MongoDB Atlas");
  } catch (error) {
    console.error("Error MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;