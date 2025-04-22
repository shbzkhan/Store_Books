import mongoose from "mongoose";

const connectDB = async () => {
    try {
    const connInstance = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`\n MONGODB connected !!! DB Host ${connInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection failed.", error);
        process.exit(1);
    }
}

export default connectDB;