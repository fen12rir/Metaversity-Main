import { json, redirect } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";
import Activity from "../models/activityModel.js";
import User from "../models/userModel.js";
import ProofOfWork from "../models/proofOfWorkModel.js";
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
  const activityId = formData.get("activityId");
  const participantUserId = formData.get("participantUserId");
  const isPresent = formData.get("isPresent") === "true";

  if (!activityId || !participantUserId) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return json({ error: "Activity not found" }, { status: 404 });
    }

    const participant = activity.participants.find(
      (p) => p.userId.toString() === participantUserId
    );

    if (!participant) {
      return json({ error: "Participant not found" }, { status: 404 });
    }

    participant.isPresent = isPresent;
    await activity.save();

    if (isPresent) {
      const participantUser = await User.findById(participantUserId);
      participantUser.bayanihanPoints = (participantUser.bayanihanPoints || 0) + activity.bayanihanPoints;
      
      const newLevel = Math.floor(participantUser.bayanihanPoints / 1000) + 1;
      participantUser.level = newLevel;
      
      await participantUser.save();

      await ProofOfWork.create({
        userId: participantUserId,
        activityId,
        description: `Completed: ${activity.title}`,
        verified: true,
        verifiedAt: new Date(),
      });
    }

    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

