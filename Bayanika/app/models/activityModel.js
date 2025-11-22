import mongoose from 'mongoose';
import {ObjectId} from "mongodb";

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    activityImg: { type: String, required: false },
    description: { type: String, required: true },
    location: { type: String, required: false },
    barangayId: { type: ObjectId, required: false, default: null },
    category: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    bayanihanPoints: { type: Number, required: true },
    maxParticipants: { type: Number, required: true, default: 50 },
    type: { type: String, required: true },
    status: { type: String, required: true, default: "upcoming" },
    participants: [{
        userId: { type: ObjectId, required: true },
        isPresent: { type: Boolean, default: null },
        joinedAt: { type: Date, required: true },
        proofOfWork: { type: String, required: false },
        onChainTxHash: { type: String, required: false },
    }]
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity;

