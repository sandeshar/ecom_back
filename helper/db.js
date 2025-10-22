import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Only connect if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("✅ MongoDB connected successfully");
        } else {
            console.log("⚙️ MongoDB connection already established");
        }
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit process if DB connection fails
    }
};

// Option 1: export connection function
export default connectDB;
