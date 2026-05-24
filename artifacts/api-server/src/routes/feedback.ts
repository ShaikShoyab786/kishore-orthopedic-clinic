import { Router } from "express";
import { db, feedbackTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const feedbackRouter = Router();

feedbackRouter.get("/feedback", (_req, res) => {
  res.render("feedback", {
    title: "Share Your Experience",
    page: "feedback",
    success: false,
    error: null,
  });
});

feedbackRouter.post("/feedback", async (req, res) => {
  const { patient_name, treatment, rating, message } = req.body as Record<string, string>;
  const ratingNum = parseInt(rating ?? "", 10);

  if (!patient_name?.trim() || !treatment?.trim() || !ratingNum || !message?.trim()) {
    return res.render("feedback", {
      title: "Share Your Experience",
      page: "feedback",
      success: false,
      error: "Please fill in all fields and select a star rating.",
    });
  }

  if (ratingNum < 1 || ratingNum > 5) {
    return res.render("feedback", {
      title: "Share Your Experience",
      page: "feedback",
      success: false,
      error: "Please select a rating between 1 and 5 stars.",
    });
  }

  try {
    await db.insert(feedbackTable).values({
      patientName: patient_name.trim().slice(0, 120),
      treatment: treatment.trim().slice(0, 120),
      rating: ratingNum,
      message: message.trim().slice(0, 1000),
    });
    res.render("feedback", {
      title: "Share Your Experience",
      page: "feedback",
      success: true,
      error: null,
    });
  } catch (err) {
    req.log.error(err, "feedback insert failed");
    res.render("feedback", {
      title: "Share Your Experience",
      page: "feedback",
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
});

feedbackRouter.get("/admin-feedback", async (req, res) => {
  try {
    const feedbacks = await db
      .select()
      .from(feedbackTable)
      .orderBy(desc(feedbackTable.createdAt));
    res.render("admin-feedback", {
      title: "Feedback Management",
      page: "admin",
      feedbacks,
    });
  } catch (err) {
    req.log.error(err, "admin-feedback fetch failed");
    res.render("admin-feedback", {
      title: "Feedback Management",
      page: "admin",
      feedbacks: [],
    });
  }
});

feedbackRouter.post("/admin-feedback/approve/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.redirect("/admin-feedback");
  await db.update(feedbackTable).set({ status: "approved" }).where(eq(feedbackTable.id, id));
  res.redirect("/admin-feedback");
});

feedbackRouter.post("/admin-feedback/reject/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.redirect("/admin-feedback");
  await db.update(feedbackTable).set({ status: "pending" }).where(eq(feedbackTable.id, id));
  res.redirect("/admin-feedback");
});

feedbackRouter.post("/admin-feedback/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.redirect("/admin-feedback");
  await db.delete(feedbackTable).where(eq(feedbackTable.id, id));
  res.redirect("/admin-feedback");
});

feedbackRouter.post("/admin-feedback/reply/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.redirect("/admin-feedback");
  const { reply } = req.body as { reply?: string };
  const replyText = reply?.trim() || null;
  await db.update(feedbackTable).set({ hospitalReply: replyText }).where(eq(feedbackTable.id, id));
  res.redirect("/admin-feedback");
});

export default feedbackRouter;
