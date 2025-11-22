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
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Proof of Work</h1>
          <Link
            to="/proof-of-work/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Submit Proof
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proofOfWorks.map((pow) => (
            <div key={pow._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">
                {pow.activityId?.title || "Activity"}
              </h2>
              <p className="text-gray-600 mb-4">{pow.description}</p>
              {pow.onChainTxHash && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Transaction Hash:</p>
                  <a
                    href={`https://basescan.org/tx/${pow.onChainTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 text-sm break-all"
                  >
                    {pow.onChainTxHash.slice(0, 20)}...
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    pow.verified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {pow.verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

