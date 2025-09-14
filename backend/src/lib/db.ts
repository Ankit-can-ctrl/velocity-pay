import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

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

export async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached) {
    try {
      cached.promise = mongoose.connect(MONGO_URI).then((m) => {
        //m is the connected mongoose instance
        console.log("DB connected :)");
        return m;
      });
      console.log("DB connected successfully :)");
    } catch (error) {
      console.log("something went wrong while connecting to db:", error);
      throw new Error("Failed to connect to DB :(");
    }
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
