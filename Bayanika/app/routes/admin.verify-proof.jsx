import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { createCookieSessionStorage } from "@remix-run/node";
import User from "../models/userModel.js";
import ProofOfWork from "../models/proofOfWorkModel.js";
import Activity from "../models/activityModel.js";
import connectDb from "../config/db.js";
import Navigation from "../components/Navigation.jsx";
import { mintProofOfWorkNFT } from "../utils/blockchain.js";

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

export const loader = async ({ request }) => {
  await connectDb();
  
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  const user = await User.findById(userId);
  
  if (user.role !== "admin") {
    return redirect("/dashboard");
  }

  const proofOfWorks = await ProofOfWork.find({ verified: false })
    .populate("userId")
    .populate("activityId")
    .sort({ createdAt: -1 });

  return json({ user, proofOfWorks });
};

export const action = async ({ request }) => {
  await connectDb();
  
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  
  if (user.role !== "admin") {
    return json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const proofId = formData.get("proofId");
  const action = formData.get("action");

  const proof = await ProofOfWork.findById(proofId).populate("activityId");
  
  if (!proof) {
    return json({ error: "Proof not found" }, { status: 404 });
  }

  if (action === "approve") {
    proof.verified = true;
    proof.verifiedAt = new Date();

    // Mint NFT on Base blockchain (if private key is configured)
    try {
      if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== 'your-private-key-for-nft-minting-optional') {
        const participant = await User.findById(proof.userId);
        
        // Create metadata for the NFT
        const metadata = JSON.stringify({
          name: `Bayanihan Proof: ${proof.activityId.title}`,
          description: proof.description,
          activity: proof.activityId.title,
          category: proof.activityId.category,
          points: proof.activityId.bayanihanPoints,
          participant: `${participant.firstName} ${participant.lastName}`,
          date: new Date().toISOString(),
        });

        // Mint NFT (if user has wallet address)
        if (participant.walletAddress) {
          const txHash = await mintProofOfWorkNFT(
            process.env.PRIVATE_KEY,
            participant.walletAddress,
            metadata
          );
          proof.onChainTxHash = txHash;
          console.log(`✅ NFT minted! Transaction: ${txHash}`);
        }
      }
    } catch (error) {
      console.error('❌ Error minting NFT:', error);
      // Continue even if NFT minting fails
    }

    await proof.save();

    // Award points to user
    const participant = await User.findById(proof.userId);
    participant.bayanihanPoints += proof.activityId.bayanihanPoints;
    await participant.save();

    return json({ 
      success: true, 
      message: proof.onChainTxHash 
        ? "Proof verified, points awarded, and NFT minted on Base!" 
        : "Proof verified and points awarded!"
    });
  } else if (action === "reject") {
    await ProofOfWork.findByIdAndDelete(proofId);
    return json({ success: true, message: "Proof rejected and removed." });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function VerifyProof() {
  const { user, proofOfWorks } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Verify Proof of Work</h1>
          <p className="text-gray-600">Review and approve community contributions</p>
        </div>

        {actionData?.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6 shadow-md">
            ✅ {actionData.message}
          </div>
        )}

        {actionData?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md">
            ❌ {actionData.error}
          </div>
        )}

        <div className="space-y-6">
          {proofOfWorks.length > 0 ? (
            proofOfWorks.map((proof) => (
              <div key={proof._id} className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {proof.userId.firstName} {proof.userId.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{proof.userId.email}</p>
                      </div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-indigo-900 mb-2">Activity</h4>
                      <p className="text-lg font-bold text-gray-900">{proof.activityId.title}</p>
                      <p className="text-sm text-gray-600">{proof.activityId.category}</p>
                    </div>
                  </div>
                  <div className="ml-6 text-center bg-indigo-50 rounded-xl p-4">
                    <div className="text-4xl font-bold text-indigo-600">{proof.activityId.bayanihanPoints}</div>
                    <div className="text-sm text-gray-600">BP Reward</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Contribution Description</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{proof.description}</p>
                </div>

                {proof.proofUrl && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Proof URL</h4>
                    <a
                      href={proof.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 underline break-all"
                    >
                      {proof.proofUrl}
                    </a>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Submitted {new Date(proof.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>

                <div className="flex space-x-4">
                  <Form method="post" className="flex-1">
                    <input type="hidden" name="proofId" value={proof._id} />
                    <input type="hidden" name="action" value="approve" />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      ✅ Approve & Award Points
                    </button>
                  </Form>
                  <Form method="post" className="flex-1">
                    <input type="hidden" name="proofId" value={proof._id} />
                    <input type="hidden" name="action" value="reject" />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      ❌ Reject
                    </button>
                  </Form>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <span className="text-8xl mb-4 block">✅</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending proof of work submissions to review.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

