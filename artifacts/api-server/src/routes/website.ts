import { Router } from "express";
import { db, feedbackTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const websiteRouter = Router();

websiteRouter.get("/", async (req, res) => {
  try {
    const testimonials = await db
      .select()
      .from(feedbackTable)
      .where(eq(feedbackTable.status, "approved"))
      .orderBy(desc(feedbackTable.createdAt))
      .limit(12);
    res.render("home", { title: "Home", page: "home", testimonials });
  } catch (err) {
    req.log.error(err, "home testimonials fetch failed");
    res.render("home", { title: "Home", page: "home", testimonials: [] });
  }
});

websiteRouter.get("/about", (_req, res) => {
  res.render("about", { title: "About Us", page: "about" });
});

websiteRouter.get("/doctors", (_req, res) => {
  res.render("doctors", { title: "Our Doctors", page: "doctors" });
});

websiteRouter.get("/treatments", (_req, res) => {
  res.render("treatments", { title: "Treatments", page: "treatments" });
});

websiteRouter.get("/contact", (_req, res) => {
  res.render("contact", { title: "Contact Us", page: "contact" });
});

export default websiteRouter;
