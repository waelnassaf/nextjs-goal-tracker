// const mongoose = require("mongoose");

// export default async function dbConnect() {
//   await mongoose.connect(process.env.DATABASE_URL, {
//     dbName: "tracker",
//     serverSelectionTimeoutMS: 30000,
//   });
// }

import mongoose from "mongoose";
const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;

  // Ensure all models are loaded
  await import("@/models/Category");
  await import("@/models/User");
  await import("@/models/Goal");

  return cached.conn;
}

export default dbConnect;
