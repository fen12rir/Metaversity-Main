import { json, redirect } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import ProofOfWork from "../models/proofOfWorkModel.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import { mintProofOfWorkNFT, verifyTransaction } from "../utils/blockchain.js";
import connectDb from "../config/db.js";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "bayanika-secret"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const action = async ({ request }) => {
  await connectDb();
  
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const proofOfWorkId = formData.get("proofOfWorkId");
  const walletAddress = formData.get("walletAddress");

  if (!proofOfWorkId || !walletAddress) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const proofOfWork = await ProofOfWork.findById(proofOfWorkId);
    const user = await User.findById(userId);

    if (!proofOfWork || proofOfWork.userId.toString() !== userId) {
      return json({ error: "Proof of work not found" }, { status: 404 });
    }

    if (proofOfWork.onChainTxHash) {
      return json({ error: "Already minted" }, { status: 409 });
    }

    if (!user.walletAddress) {
      user.walletAddress = walletAddress;
      await user.save();
    }

    const metadataUri = `https://bayanika.app/proof/${proofOfWorkId}`;
    
    const txHash = await mintProofOfWorkNFT(
      process.env.PRIVATE_KEY,
      walletAddress,
      metadataUri
    );

    proofOfWork.onChainTxHash = txHash;
    await proofOfWork.save();

    const verified = await verifyTransaction(txHash);
    if (verified) {
      proofOfWork.verified = true;
      proofOfWork.verifiedAt = new Date();
      await proofOfWork.save();

      const activity = await Activity.findById(proofOfWork.activityId);
      if (activity) {
        const participant = activity.participants.find(
          (p) => p.userId.toString() === userId
        );
        if (participant) {
          participant.onChainTxHash = txHash;
          await activity.save();
        }
      }
    }

    return json({ success: true, txHash, verified });
  } catch (error) {
    console.error("Error minting NFT:", error);
    return json({ error: error.message }, { status: 500 });
  }
};

