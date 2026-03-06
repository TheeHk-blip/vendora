import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null; 
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI as string;
  if (!MONGODB_URI) throw new Error ("MONGO URI not defined in env variables");

  const cached: MongooseCache = (global as unknown as {mongoose: MongooseCache}).mongoose || { conn: null, promise: null};
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export const clientPromise = connectDB().then((conn) => {
  return conn.connection.getClient();
});