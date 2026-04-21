import { generateResponse } from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

// ✅ GENERATE WEBSITE
export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.credits < 50) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    const userPrompt = prompt.toLowerCase();

    let tech = "html";
    if (userPrompt.includes("mern")) tech = "mern";
    else if (userPrompt.includes("react")) tech = "react";

    const baseRules = `
YOU ARE A SENIOR FULL STACK ENGINEER.
RETURN STRICT JSON ONLY.

FORMAT:
{
  "message": "Project generated",
  "files": [
    {
      "path": "/file",
      "content": "code"
    }
  ]
}
`;

    let dynamicPrompt = `${baseRules}\nUSER REQUEST:\n${prompt}`;

    let raw = await generateResponse(dynamicPrompt);
    let parsed = await extractJson(raw);

    if (!parsed || !parsed.files) {
      return res.status(400).json({ message: "AI failed" });
    }

    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 60),
      latestCode: JSON.stringify(parsed.files),
    });

    user.credits -= 50;
    await user.save();

    res.json({
      websiteId: website._id,
      files: parsed.files,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL
export const getAll = async (req, res) => {
  try {
    const websites = await Website.find().sort({ createdAt: -1 });
    res.json(websites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET BY ID
export const getWebsiteById = async (req, res) => {
  try {
    const { id } = req.params;

    const website = await Website.findById(id);

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    res.json(website);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};