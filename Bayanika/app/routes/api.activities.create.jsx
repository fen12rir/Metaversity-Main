import { json, redirect } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import Activity from "../models/activityModel.js";
import User from "../models/userModel.js";
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
  
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  const user = await User.findById(userId);
  if (user.role !== "barangay" && user.role !== "admin") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");
  const bayanihanPoints = parseInt(formData.get("bayanihanPoints") || "0");
  const category = formData.get("category");
  const type = formData.get("type") || "one-time";

  if (!title || !description || !startDate || !endDate) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const activity = await Activity.create({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      bayanihanPoints,
      category,
      type,
      barangayId: user.barangayId,
      status: "upcoming",
    });

    return json({ success: true, activity });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

