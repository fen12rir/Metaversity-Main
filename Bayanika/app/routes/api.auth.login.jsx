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

