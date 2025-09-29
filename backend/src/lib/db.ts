import mongoose from "mongoose";

/*========= global object in nodejs is similar to window in browser  */
/*global object lives for the lifetime of your app  */
/* so we can attach properties to it and can access them anywhere in our project */
let cached = (global as any).mongoose;
/*here we have created a global variable called mongoose */

// global.mongoose is a object with properties conn and promise
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null, //stores actuall mongodb connection
    promise: null, //store connection promise so we dont create multiple connection at the same time
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const MONGO_URI = process.env.MONGO_URI as string;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI);
  }

  try {
    cached.conn = await cached.promise;
    console.log("DB connected successfully :)");
    return cached.conn;
  } catch (error) {
    console.log("something went wrong while connecting to db:", error);
    (cached as any).promise = null;
    throw new Error("Failed to connect to DB :(");
  }
}
