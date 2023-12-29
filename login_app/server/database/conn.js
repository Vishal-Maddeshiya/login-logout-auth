import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import ENV from "../config.js";

async function connect() {
  const mongodb = await MongoMemoryServer.create();
  const getUri = mongodb.getUri();

  mongoose.set("strictQuery", true);
  // const db = await mongoose.connect(getUri);
  const db = await mongoose.connect(ENV.ATLAS_URI);
  console.log("Database connected");
  return db;
}

export default connect;
