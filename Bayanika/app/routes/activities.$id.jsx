import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link, Form, useActionData, useNavigation } from "@remix-run/react";
import { createCookieSessionStorage } from "@remix-run/node";
import Activity from "../models/activityModel.js";
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

export const loader = async ({ params, request }) => {
  await connectDb();
  
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  const user = await User.findById(userId);
  const activity = await Activity.findById(params.id);
  
  if (!activity) {
    throw new Response("Activity not found", { status: 404 });
  }

  const hasJoined = activity.participants?.some(p => p.userId.toString() === userId);
  const proofOfWork = await ProofOfWork.findOne({ userId, activityId: params.id });

  return json({ user, activity, hasJoined, proofOfWork });
};

export const action = async ({ params, request }) => {
  await connectDb();
  
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "join") {
    const activity = await Activity.findById(params.id);
    
    if (!activity) {
      return json({ error: "Activity not found" }, { status: 404 });
    }

    const hasJoined = activity.participants?.some(p => p.userId.toString() === userId);
    
    if (hasJoined) {
      return json({ error: "You have already joined this activity" }, { status: 400 });
    }

    if (activity.participants?.length >= activity.maxParticipants) {
      return json({ error: "Activity is full" }, { status: 400 });
    }

    activity.participants.push({
      userId,
      joinedAt: new Date(),
      isPresent: null,
    });

    await activity.save();

    return json({ success: true, message: "Successfully joined the activity!" });
  }

  if (actionType === "submitProof") {
    const description = formData.get("description");
    const proofUrl = formData.get("proofUrl");

    const activity = await Activity.findById(params.id);
    const hasJoined = activity.participants?.some(p => p.userId.toString() === userId);

    if (!hasJoined) {
      return json({ error: "You must join the activity first" }, { status: 400 });
    }

    // Check if proof already exists
    const existingProof = await ProofOfWork.findOne({ userId, activityId: params.id });
    
    if (existingProof) {
      return json({ error: "You have already submitted proof for this activity" }, { status: 400 });
    }

    await ProofOfWork.create({
      userId,
      activityId: params.id,
      description,
      proofUrl,
      verified: false,
    });

    return json({ success: true, message: "Proof of work submitted! Awaiting verification." });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function ActivityDetail() {
  const { user, activity, hasJoined, proofOfWork } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const isFull = activity.participants?.length >= activity.maxParticipants;
  const hasSubmittedProof = !!proofOfWork;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation user={user} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/activities" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-flex items-center font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Activities
        </Link>

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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-3">
                  {activity.category}
                </span>
                <h1 className="text-4xl font-bold mb-4">{activity.title}</h1>
                <p className="text-indigo-100 text-lg">{activity.description}</p>
              </div>
              <div className="ml-6 text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-5xl font-bold">{activity.bayanihanPoints}</div>
                <div className="text-sm font-medium">Bayanihan Points</div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center text-gray-500 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Start Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(activity.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(activity.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div>
                <div className="flex items-center text-gray-500 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{activity.location || 'TBA'}</p>
              </div>

              <div>
                <div className="flex items-center text-gray-500 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-sm font-medium">Participants</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {activity.participants?.length || 0} / {activity.maxParticipants}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${((activity.participants?.length || 0) / activity.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center text-gray-500 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm font-medium">Type</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 capitalize">{activity.type}</p>
                <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                  activity.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                  activity.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6">
            {!hasJoined ? (
              <Form method="post">
                <input type="hidden" name="actionType" value="join" />
                <button
                  type="submit"
                  disabled={isFull || isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                    isFull
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isFull ? '❌ Activity is Full' : isSubmitting ? 'Joining...' : '✅ Join This Activity'}
                </button>
              </Form>
            ) : !hasSubmittedProof ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg">
                  ✅ You have joined this activity!
                </div>
                <div className="bg-white border-2 border-indigo-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Proof of Work</h3>
                  <Form method="post" className="space-y-4">
                    <input type="hidden" name="actionType" value="submitProof" />
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description of your contribution
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Describe what you did during this activity..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Proof URL (optional - photo/document link)
                      </label>
                      <input
                        type="url"
                        name="proofUrl"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isSubmitting ? 'Submitting...' : '📝 Submit Proof of Work'}
                    </button>
                  </Form>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg">
                  📝 Proof of work submitted! {proofOfWork.verified ? '✅ Verified' : '⏳ Awaiting verification'}
                </div>
                {proofOfWork.verified && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-green-900 mb-2">🎉 Congratulations!</h3>
                        <p className="text-green-700">You earned <span className="font-bold text-2xl">{activity.bayanihanPoints}</span> Bayanihan Points!</p>
                      </div>
                      {proofOfWork.onChainTxHash && (
                        <a
                          href={`https://basescan.org/tx/${proofOfWork.onChainTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          View on Blockchain
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
