import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;
let connectionPromise = null;

const connectDb = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('Database already connected');
        return;
    }

    if (connectionPromise) {
        console.log('Connection already in progress, waiting...');
        return connectionPromise;
    }

    connectionPromise = (async () => {
        try {
            let mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/bayanika";
            console.log('Original URI (first 50 chars):', mongoUri.substring(0, 50));
            
            if (mongoUri.includes('mongodb+srv://')) {
                if (mongoUri.includes('/?')) {
                    mongoUri = mongoUri.replace('/?', '/bayanika?');
                } else if (mongoUri.endsWith('/')) {
                    mongoUri = mongoUri + 'bayanika';
                } else if (!mongoUri.match(/\/[^\/\?]+(\?|$)/)) {
                    mongoUri = mongoUri + '/bayanika';
                }
            } else if (!mongoUri.includes('/bayanika')) {
                const separator = mongoUri.endsWith('/') ? '' : '/';
                mongoUri = mongoUri + separator + 'bayanika';
            }
            
            console.log('Final connection URI (first 50 chars):', mongoUri.substring(0, 50));
            console.log('Attempting to connect to MongoDB...');
            
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
            });
            
            isConnected = true;
            connectionPromise = null;
            console.log('✅ Connected to MongoDB');
            console.log('📊 Database:', mongoose.connection.name);
        } catch (err) {
            console.error('❌ Error connecting to MongoDB:', err.message);
            console.error('Full error:', err);
            isConnected = false;
            connectionPromise = null;
            throw err;
        }
    })();

    return connectionPromise;
}

export default connectDb;

