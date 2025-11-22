import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import User from "../models/userModel.js";
import { comparePassword, generateToken } from "../utils/auth.js";
import connectDb from "../config/db.js";

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

export const loader = async () => {
  return json({});
};

export const action = async ({ request }) => {
  await connectDb();
  
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken(user._id);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    session.set("userId", user._id.toString());
    session.set("token", token);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Bayanika</h1>
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {actionData?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {actionData.error}
          </div>
        )}
        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      </div>
    </div>
  );
}

