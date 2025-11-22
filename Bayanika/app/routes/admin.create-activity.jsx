import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
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
  
  if (user.role !== "admin") {
    return redirect("/dashboard");
  }

  return json({ user });
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
  const title = formData.get("title");
  const description = formData.get("description");
  const type = formData.get("type");
  const category = formData.get("category");
  const location = formData.get("location");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");
  const bayanihanPoints = parseInt(formData.get("bayanihanPoints"));
  const maxParticipants = parseInt(formData.get("maxParticipants"));

  try {
    await Activity.create({
      title,
      description,
      type,
      category,
      location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      bayanihanPoints,
      maxParticipants,
      status: "upcoming",
    });

    return redirect("/admin/dashboard");
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

export default function CreateActivity() {
  const { user } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navigation user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Activity</h1>
          <p className="text-gray-600">Set up a new Bayanihan activity for the community</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {actionData?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {actionData.error}
            </div>
          )}

          <Form method="post" className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Community Clean-Up Drive"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe the activity and what participants will do..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="volunteer">Volunteer Work</option>
                  <option value="event">Community Event</option>
                  <option value="training">Training/Workshop</option>
                  <option value="project">Community Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Social Welfare">Social Welfare</option>
                  <option value="Disaster Response">Disaster Response</option>
                  <option value="Youth Development">Youth Development</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Barangay Hall, Community Center"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bayanihan Points Reward</label>
                <input
                  type="number"
                  name="bayanihanPoints"
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Participants</label>
                <input
                  type="number"
                  name="maxParticipants"
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 30"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? "Creating..." : "Create Activity"}
              </button>
              <Link
                to="/admin/dashboard"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}

