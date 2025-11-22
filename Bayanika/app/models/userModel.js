import mongoose from 'mongoose';
import {ObjectId} from "mongodb";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
    walletAddress: { type: String, required: false },
    role: { type: String, default: "public_user" },
    barangayId: { type: ObjectId, required: false, default: null },
    bayanihanPoints: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: ObjectId, ref: 'Badge' }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

