import { json, redirect } from "@remix-run/node";
import User from "../models/userModel.js";
import { hashPassword } from "../utils/auth.js";
import connectDb from "../config/db.js";

export const action = async ({ request }) => {
  await connectDb();
  
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");

  if (!firstName || !lastName || !email || !username || !password) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    return redirect("/login");
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

