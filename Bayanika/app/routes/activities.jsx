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

import { useState } from "react";

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
  const [selectedActivity, setSelectedActivity] = useState(null);

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
            <div 
              key={activity._id} 
              onClick={() => setSelectedActivity(activity)}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
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
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md inline-block">
                    View Details →
                  </span>
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

      {/* Modal */}
      {selectedActivity && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedActivity(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 text-white relative">
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold"
              >
                ✕
              </button>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-3">
                {selectedActivity.category}
              </span>
              <h2 className="text-3xl font-bold mb-3">{selectedActivity.title}</h2>
              <p className="text-indigo-100">{selectedActivity.description}</p>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Start Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedActivity.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedActivity.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{selectedActivity.location || 'TBA'}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm font-medium">Participants</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedActivity.participants?.length || 0} / {selectedActivity.maxParticipants}
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Reward</span>
                  </div>
                  <p className="text-3xl font-bold text-indigo-600">{selectedActivity.bayanihanPoints} BP</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Link
                  to={`/activities/${String(selectedActivity._id)}`}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-center hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  ✅ Join This Activity
                </Link>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
