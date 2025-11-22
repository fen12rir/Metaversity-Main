import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { createCookieSessionStorage } from "@remix-run/node";
import ProofOfWork from "../models/proofOfWorkModel.js";
import Activity from "../models/activityModel.js";
import User from "../models/userModel.js";
import connectDb from "../config/db.js";
import Navigation from "../components/Navigation.jsx";

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
  const proofOfWorks = await ProofOfWork.find({ userId })
    .populate("activityId")
    .sort({ createdAt: -1 });

  return json({ user, proofOfWorks });
};

export default function ProofOfWorkPage() {
  const { user, proofOfWorks } = useLoaderData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📝 My Proof of Work</h1>
          <p className="text-gray-600 text-lg">Track your submitted contributions and verifications</p>
        </div>

        {proofOfWorks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofOfWorks.map((pow) => (
              <div key={pow._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <span className="text-6xl">
                    {pow.verified ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {pow.activityId?.category || 'Activity'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        pow.verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {pow.verified ? "✅ Verified" : "⏳ Pending"}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {pow.activityId?.title || "Activity"}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pow.description}</p>
                  
                  {pow.proofUrl && (
                    <div className="mb-4">
                      <a
                        href={pow.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Proof
                      </a>
                    </div>
                  )}

                  {pow.verified && pow.activityId?.bayanihanPoints && (
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <p className="text-green-800 font-semibold text-center">
                        🎉 Earned {pow.activityId.bayanihanPoints} BP
                      </p>
                    </div>
                  )}

                  {pow.onChainTxHash && (
                    <a
                      href={`https://basescan.org/tx/${pow.onChainTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      View on Blockchain
                    </a>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Submitted {new Date(pow.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <span className="text-8xl mb-4 block">📭</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Proof of Work Yet</h3>
            <p className="text-gray-600 mb-6">Join activities and submit your contributions to get started!</p>
            <Link
              to="/activities"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Browse Activities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

