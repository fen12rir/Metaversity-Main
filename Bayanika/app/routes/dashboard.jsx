import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { createCookieSessionStorage } from "@remix-run/node";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
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
  const activities = await Activity.find({ status: "upcoming" }).limit(5);

  return json({ user, activities });
};

export default function Dashboard() {
  const { user, activities } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kumusta, {user.firstName}! 👋</h1>
          <p className="text-gray-600 text-lg">Track your Bayanihan contributions and make an impact</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Bayanihan Points</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-5xl font-bold">{user.bayanihanPoints || 0}</p>
            <p className="text-sm opacity-75 mt-2">Keep earning to unlock rewards!</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Level</h3>
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-5xl font-bold">{user.level || 1}</p>
            <p className="text-sm opacity-75 mt-2">Bayani in the making!</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Badges</h3>
              <span className="text-3xl">🏅</span>
            </div>
            <p className="text-5xl font-bold">{user.badges?.length || 0}</p>
            <p className="text-sm opacity-75 mt-2">Collect them all!</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Activities 🎯</h2>
            <Link
              to="/activities"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity._id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-2">
                        {activity.category}
                      </span>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{activity.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{activity.description}</p>
                    </div>
                    <div className="ml-4 text-center bg-indigo-50 rounded-lg p-3">
                      <div className="text-3xl font-bold text-indigo-600">{activity.bayanihanPoints}</div>
                      <div className="text-xs text-gray-600">BP</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {activity.participants?.length || 0} / {activity.maxParticipants} joined
                    </div>
                    <Link
                      to={`/activities/${String(activity._id)}`}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-500 text-lg">No upcoming activities at the moment</p>
                <p className="text-gray-400 text-sm">Check back soon for new opportunities!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

