import "server-only";
import { MongoClient } from "mongodb";

// Reuse one client across hot reloads and serverless invocations.
const globalForMongo = globalThis;
const client = (globalForMongo.__fixmateMongo ??= new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"));

export const db = client.db(process.env.DB_NAME || "fixmate");
