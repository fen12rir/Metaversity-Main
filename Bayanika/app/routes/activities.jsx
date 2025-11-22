import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { createCookieSessionStorage } from "@remix-run/node";
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
  const activities = await Activity.find({}).sort({ startDate: 1 });
  
  return json({ user, activities });
};

function getCategoryEmoji(category) {
  const emojis = {
    'Environment': '🌱',
    'Education': '📚',
    'Health': '🏥',
    'Social Welfare': '🤝',
    'Disaster Response': '🚨',
    'Youth Development': '👦',
  };
  return emojis[category] || '🎯';
}

export default function Activities() {
  const { user, activities } = useLoaderData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Activities 🎯</h1>
          <p className="text-gray-600 text-lg">Join activities and earn Bayanihan Points!</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-6xl">{getCategoryEmoji(activity.category)}</span>
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-3">
                  {activity.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {activity.participants?.length || 0} / {activity.maxParticipants} joined
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-indigo-600">{activity.bayanihanPoints}</span>
                    <span className="text-sm text-gray-500 ml-1">BP</span>
                  </div>
                  <Link
                    to={`/activities/${activity._id}`}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-20">
            <span className="text-8xl mb-4 block">📭</span>
            <p className="text-gray-500 text-2xl font-semibold">No activities available</p>
            <p className="text-gray-400 text-lg mt-2">Check back soon for new opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
}
