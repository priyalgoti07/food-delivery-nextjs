// const { username, password } = process.env
// export const connectionStr = `mongodb+srv://${username}:${password}@cluster0.kqrqvex.mongodb.net/restoDB?retryWrites=true&w=majority&appName=Cluster0`;
import { MongoClient } from "mongodb";

// Use a single environment variable
export const connectionStr = process.env.MONGODB_URI;

if (!connectionStr) {
    throw new Error("MONGODB_URI is not set in environment variables.");
}

// Cache system (same as before)
let cached = global.mongo;
if (!cached) cached = global.mongo = { conn: null, promise: null };

export async function connectToDatabase() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        const client = new MongoClient(connectionStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        cached.promise = client.connect().then((client) => ({
            client,
            db: client.db(),
        }));
    }
    cached.conn = await cached.promise;
    return cached.conn;
}


