import express from "express";
import isAuth from "../middlewares/isAuth.js";   // ✅ ADD THIS

import {
  generateWebsite,
  getWebsiteById,
  getAll
} from "../controllers/website.controllers.js";

const websiteRouter = express.Router();

// ✅ FIX: middleware add karo
websiteRouter.post("/generate", isAuth, generateWebsite);

websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.get("/get-all", isAuth, getAll);

export default websiteRouter;