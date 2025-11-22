import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { createCookieSessionStorage } from "@remix-run/node";
import User from "../models/userModel.js";
import ProofOfWork from "../models/proofOfWorkModel.js";
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
  const proofOfWorks = await ProofOfWork.find({ userId }).countDocuments();

  return json({ user, proofOfWorks });
};

export default function Profile() {
  const { user, proofOfWorks } = useLoaderData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navigation user={user} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mr-6">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-600 text-lg">Level {user.level || 1} Bayani</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
              <p className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Username</h3>
              <p className="text-lg text-gray-900">{user.username}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Wallet Address</h3>
              <p className="text-lg text-gray-900">
                {user.walletAddress || "Not connected"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Bayanihan Points</h3>
              <p className="text-3xl font-bold text-indigo-600">{user.bayanihanPoints || 0}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Level</h3>
              <p className="text-3xl font-bold text-indigo-600">{user.level || 1}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Proof of Works</h3>
              <p className="text-3xl font-bold text-indigo-600">{proofOfWorks}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/proof-of-work"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              View Proof of Work
            </Link>
            <Link
              to="/leaderboard"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

