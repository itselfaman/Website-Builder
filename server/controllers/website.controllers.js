import { generateResponse } from "../config/openRouter.js";
import Website from "../models/website.model.js";
import archiver from "archiver";

// ============================================
// GENERATE / UPDATE WEBSITE
// ============================================
export const generateWebsite = async (req, res) => {

  try {

    const {
      prompt,
      existingCode,
      websiteId,
    } = req.body;

    if (!prompt) {

      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    console.log("PROMPT:", prompt);

    // ============================================
    // AI PROMPT
    // ============================================
    const dynamicPrompt = `
Generate a complete modern website.

USER REQUEST:
${prompt}

EXISTING CODE:
${existingCode || "none"}

IMPORTANT:
- Modify existing code if provided
- Use HTML CSS JS only
- Make responsive modern UI
- Use dark modern design
- Use animations if needed
- Use picsum.photos for images

Return ONLY valid JSON.

DO NOT:
- use markdown
- use triple backticks
- explain anything
- write extra text

FORMAT:

{
  "files": [
    {
      "path": "index.html",
      "content": "HTML CODE"
    },
    {
      "path": "style.css",
      "content": "CSS CODE"
    },
    {
      "path": "script.js",
      "content": "JS CODE"
    }
  ]
}
`;

    // ============================================
    // GENERATE AI RESPONSE
    // ============================================
    const raw = await generateResponse(
      dynamicPrompt
    );

    console.log("RAW AI RESPONSE:");
    console.log(raw);

    // ============================================
    // PARSE JSON
    // ============================================
    let parsed = null;

    try {

      const cleaned = raw
        ?.replace(/```json/g, "")
        ?.replace(/```/g, "")
        ?.trim();

      parsed = JSON.parse(cleaned);

    } catch (err) {

      console.log("JSON ERROR:", err);

      console.log("RAW RESPONSE:");
      console.log(raw);
    }

    console.log("PARSED:");
    console.log(parsed);

    // ============================================
    // VALIDATION
    // ============================================
    if (
      !parsed ||
      !Array.isArray(parsed.files)
    ) {

      return res.status(400).json({
        message:
          "AI failed to generate valid code",
      });
    }

    // ============================================
    // UPDATE WEBSITE
    // ============================================
    if (websiteId) {

      const existingWebsite =
        await Website.findById(websiteId);

      if (!existingWebsite) {

        return res.status(404).json({
          message: "Website not found",
        });
      }

      existingWebsite.latestCode =
        JSON.stringify(parsed.files);

      await existingWebsite.save();

      return res.json({
        websiteId: existingWebsite._id,
        files: parsed.files,
        message:
          "Website updated successfully",
      });
    }

    // ============================================
    // CREATE WEBSITE
    // ============================================
    const newWebsite = await Website.create({

      title: prompt.slice(0, 60),

      latestCode: JSON.stringify(
        parsed.files
      ),
    });

    return res.json({

      websiteId: newWebsite._id,

      files: parsed.files,

      message:
        "Website created successfully",
    });

  } catch (err) {

    console.log("SERVER ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================================
// GET WEBSITE BY ID
// ============================================
export const getWebsiteById = async (
  req,
  res
) => {

  try {

    const website =
      await Website.findById(
        req.params.id
      );

    if (!website) {

      return res.status(404).json({
        message: "Website not found",
      });
    }

    const files = JSON.parse(
      website.latestCode || "[]"
    );

    res.json({
      files,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================================
// GET ALL WEBSITES
// ============================================
export const getAll = async (
  req,
  res
) => {

  try {

    const websites = await Website
      .find()
      .sort({ createdAt: -1 });

    res.json(websites);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================================
// DOWNLOAD WEBSITE ZIP
// ============================================
export const downloadWebsite = async (
  req,
  res
) => {

  try {

    const website =
      await Website.findById(
        req.params.id
      );

    if (!website) {

      return res.status(404).json({
        message: "Website not found",
      });
    }

    const files = JSON.parse(
      website.latestCode || "[]"
    );

    res.setHeader(
      "Content-Type",
      "application/zip"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=website-${req.params.id}.zip`
    );

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.pipe(res);

    files.forEach((file) => {

      archive.append(file.content, {
        name: file.path.replace(/^\//, ""),
      });
    });

    await archive.finalize();

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Download failed",
    });
  }
};