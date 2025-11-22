import mongoose from 'mongoose';
import {ObjectId} from "mongodb";

const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imgPath: { type: String, required: false },
    category: { type: String, required: true },
    rarity: { type: String, default: "common" },
    bayanihanPointsRequired: { type: Number, default: 0 },
    nftTokenId: { type: String, required: false },
}, { timestamps: true });

const Badge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);

export default Badge;

