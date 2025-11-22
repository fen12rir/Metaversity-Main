import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import User from "../models/userModel.js";
import { hashPassword } from "../utils/auth.js";
import connectDb from "../config/db.js";

export const loader = async () => {
  return json({});
};

export const action = async ({ request }) => {
  console.log("=== REGISTRATION ACTION CALLED ===");
  
  try {
    console.log("Step 1: Connecting to database...");
    const dbStart = Date.now();
    
    await Promise.race([
      connectDb(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database connection timeout after 10 seconds")), 10000)
      )
    ]);
    
    console.log(`Step 1: Database connected in ${Date.now() - dbStart}ms`);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      code: error.code
    });
    return json({ 
      error: `Database connection failed: ${error.message}. Please check your MongoDB connection string and network access.` 
    }, { status: 500 });
  }
  
  console.log("Step 2: Parsing form data...");
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");

  console.log("Step 2: Form data received:", { firstName, lastName, email, username, password: "***" });

  if (!firstName || !lastName || !email || !username || !password) {
    console.log("❌ Missing required fields");
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    console.log("Step 3: Checking for existing user...");
    const checkStart = Date.now();
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    console.log(`Step 3: User check completed in ${Date.now() - checkStart}ms`);

    if (existingUser) {
      console.log("❌ User already exists");
      return json({ error: "User already exists" }, { status: 409 });
    }

    console.log("Step 4: Hashing password...");
    const hashStart = Date.now();
    const hashedPassword = await hashPassword(password);
    console.log(`Step 4: Password hashed in ${Date.now() - hashStart}ms`);

    console.log("Step 5: Creating user...");
    const createStart = Date.now();
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });
    console.log(`Step 5: User created in ${Date.now() - createStart}ms`);
    console.log("✅ User created successfully:", user._id);

    console.log("Step 6: Redirecting to login...");
    return redirect("/login");
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("Error stack:", error.stack);
    return json({ error: error.message || "Registration failed. Please try again." }, { status: 500 });
  }
};

export default function Register() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  console.log("Register component render:", { 
    isSubmitting, 
    navigationState: navigation.state,
    actionData 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Bayanika</h1>
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
        {actionData?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {actionData.error}
          </div>
        )}
        <Form method="post" action="/register" className="space-y-4" onSubmit={(e) => {
          console.log("Form submitted to /register");
        }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
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
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </Form>
      </div>
    </div>
  );
}

