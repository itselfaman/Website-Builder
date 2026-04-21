import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { generateWebsite } from "../controllers/website.controllers.js";

const websiteRouter = express.Router();

// ✅ ONLY THIS ROUTE
websiteRouter.post("/generate", isAuth, generateWebsite);

export default websiteRouter;