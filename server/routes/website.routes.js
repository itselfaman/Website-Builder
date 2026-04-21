import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  generateWebsite,
  getWebsiteById,
  getAll
} from "../controllers/website.controllers.js";

const websiteRouter = express.Router();

// ✅ Generate
websiteRouter.post("/generate", generateWebsite);

// ✅ Get by ID
websiteRouter.get("/get-by-id/:id", getWebsiteById);

// ✅ Get all
websiteRouter.get("/get-all", getAll);

export default websiteRouter;