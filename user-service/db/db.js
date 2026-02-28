import mongoose from "mongoose";

export async function dbConn() {
  
  const url = process.env.MONGO_URL;

  // 1. Check if the URL exists before trying to connect
  if (!url) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }

  try {
    // 2. Just await the connection directly
    const res = await mongoose.connect(url);
    return res;
  } catch (err) {
    // 3. Catch and re-throw or log the error
    console.error("MongoDB Connection Error ❌", err.message);
    throw err;
  }
}
