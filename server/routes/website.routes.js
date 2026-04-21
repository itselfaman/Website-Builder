import express from "express";
import {
  generateWebsite,
  getWebsiteById,
  getAll
} from "../controllers/website.controllers.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", generateWebsite);
websiteRouter.get("/get-by-id/:id", getWebsiteById);
websiteRouter.get("/get-all", getAll);

export default websiteRouter;