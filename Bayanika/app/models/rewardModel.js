import mongoose from 'mongoose';
import {ObjectId} from "mongodb";

const rewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imgPath: { type: String, required: false },
    pointsCost: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    claimed: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

const Reward = mongoose.models.Reward || mongoose.model('Reward', rewardSchema);

export default Reward;

