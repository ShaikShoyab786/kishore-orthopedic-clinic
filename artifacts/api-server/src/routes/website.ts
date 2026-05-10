import { Router } from "express";

const websiteRouter = Router();

websiteRouter.get("/", (req, res) => {
  res.render("home", { title: "Home", page: "home" });
});

websiteRouter.get("/about", (req, res) => {
  res.render("about", { title: "About Us", page: "about" });
});

websiteRouter.get("/doctors", (req, res) => {
  res.render("doctors", { title: "Our Doctors", page: "doctors" });
});

websiteRouter.get("/treatments", (req, res) => {
  res.render("treatments", { title: "Treatments", page: "treatments" });
});

websiteRouter.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us", page: "contact" });
});

export default websiteRouter;
