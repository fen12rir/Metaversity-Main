import mongoose from 'mongoose';
import {ObjectId} from "mongodb";

const proofOfWorkSchema = new mongoose.Schema({
    userId: { type: ObjectId, required: true, ref: 'User' },
    activityId: { type: ObjectId, required: true, ref: 'Activity' },
    description: { type: String, required: true },
    proofUrl: { type: String, required: false },
    impact: { type: String, required: false },
    evidence: [{ type: String }],
    onChainTxHash: { type: String, required: false },
    nftTokenId: { type: String, required: false },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date, required: false },
}, { timestamps: true });

const ProofOfWork = mongoose.models.ProofOfWork || mongoose.model('ProofOfWork', proofOfWorkSchema);

export default ProofOfWork;

