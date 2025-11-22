import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { createCookieSessionStorage } from "@remix-run/node";
import User from "../models/userModel.js";
import Reward from "../models/rewardModel.js";
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
  const rewards = await Reward.find({ isAvailable: true }).sort({ pointsCost: 1 });

  return json({ user, rewards });
};

export const action = async ({ request }) => {
  await connectDb();
  
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const rewardId = formData.get("rewardId");

  const user = await User.findById(userId);
  const reward = await Reward.findById(rewardId);

  if (!reward) {
    return json({ error: "Reward not found" }, { status: 404 });
  }

  if (reward.stock <= 0) {
    return json({ error: "Reward out of stock" }, { status: 400 });
  }

  if (user.bayanihanPoints < reward.pointsCost) {
    return json({ error: "Insufficient Bayanihan Points" }, { status: 400 });
  }

  // Deduct points and update reward
  user.bayanihanPoints -= reward.pointsCost;
  await user.save();

  reward.claimed += 1;
  reward.stock -= 1;
  if (reward.stock === 0) {
    reward.isAvailable = false;
  }
  await reward.save();

  return json({ success: true, message: `Successfully redeemed ${reward.name}!` });
};

export default function Shop() {
  const { user, rewards } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏪 Bayanihan Shop</h1>
          <p className="text-gray-600">Redeem your Bayanihan Points for real rewards!</p>
          <div className="mt-4 inline-flex items-center bg-white px-6 py-3 rounded-full shadow-lg border-2 border-indigo-600">
            <span className="text-2xl mr-2">💰</span>
            <span className="text-lg font-semibold text-gray-700">Your Points:</span>
            <span className="text-2xl font-bold text-indigo-600 ml-2">{user.bayanihanPoints}</span>
          </div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = user.bayanihanPoints >= reward.pointsCost;
            const inStock = reward.stock > 0;

            return (
              <div key={reward._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-6xl">{getCategoryEmoji(reward.category)}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{reward.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {inStock ? `${reward.stock} left` : 'Out of Stock'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{reward.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-indigo-600">{reward.pointsCost}</span>
                      <span className="text-sm text-gray-500 ml-1">BP</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {reward.category}
                    </span>
                  </div>
                  <Form method="post">
                    <input type="hidden" name="rewardId" value={reward._id} />
                    <button
                      type="submit"
                      disabled={!canAfford || !inStock || isSubmitting}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                        canAfford && inStock
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {!inStock ? 'Out of Stock' : !canAfford ? 'Not Enough Points' : isSubmitting ? 'Redeeming...' : 'Redeem Now'}
                    </button>
                  </Form>
                </div>
              </div>
            );
          })}
        </div>

        {rewards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No rewards available at the moment. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}

function getCategoryEmoji(category) {
  const emojis = {
    'Gift Cards': '🎁',
    'Merchandise': '👕',
    'Food & Drinks': '🍔',
    'Electronics': '📱',
    'Books': '📚',
    'Vouchers': '🎟️',
    'Services': '🛠️',
  };
  return emojis[category] || '🎁';
}

