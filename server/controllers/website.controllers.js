import { generateResponse } from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.credits < 50) {
      return res.status(400).json({ message: "Not enough credits" });
    }

    // 🔥 STEP 1: TECH DETECTION
    const userPrompt = prompt.toLowerCase();

    let tech = "html";

    if (userPrompt.includes("mern")) tech = "mern";
    else if (userPrompt.includes("spring")) tech = "spring";
    else if (userPrompt.includes("flask")) tech = "flask";
    else if (userPrompt.includes("django")) tech = "django";
    else if (userPrompt.includes("react")) tech = "react";
    else if (userPrompt.includes("angular")) tech = "angular";

    // 🔥 STEP 2: BASE RULES
    const baseRules = `
YOU ARE A SENIOR FULL STACK ENGINEER.

STRICT RULES:
- Generate code EXACTLY in requested tech
- DO NOT fallback to HTML unless asked
- ALWAYS create proper folder structure
- ALWAYS separate files

OUTPUT FORMAT (STRICT JSON):
{
  "message": "Project generated",
  "files": [
    {
      "path": "/folder/file.ext",
      "content": "code here"
    }
  ]
}
`;

    // 🔥 STEP 3: DYNAMIC PROMPT
    let dynamicPrompt = "";

    if (tech === "mern") {
      dynamicPrompt = `
${baseRules}

Create a FULL MERN stack project.

Stack:
- MongoDB
- Express
- React
- Node.js

Structure:
/backend
  server.js
  routes/
  models/
/frontend
  src/
    App.jsx
    components/

Features:
- REST API
- CRUD operations
- React UI connected to backend

USER REQUEST:
${prompt}
`;
    }

    else if (tech === "react") {
      dynamicPrompt = `
${baseRules}

Create a React project.

Structure:
/src
  /components
    Navbar.jsx
    Hero.jsx
    Footer.jsx
  App.jsx

Use:
- JSX
- Functional components
- Tailwind CSS

USER REQUEST:
${prompt}
`;
    }

    else if (tech === "spring") {
      dynamicPrompt = `
${baseRules}

Create a Spring Boot backend with React frontend.

Structure:
/backend (Java Spring Boot)
/frontend (React)

Include:
- Controller
- Service
- Entity
- REST API

USER REQUEST:
${prompt}
`;
    }

    else if (tech === "flask") {
      dynamicPrompt = `
${baseRules}

Create a Flask project.

Structure:
/backend
  app.py
/templates
  index.html

Include:
- API routes
- Basic frontend

USER REQUEST:
${prompt}
`;
    }

    else {
      dynamicPrompt = `
${baseRules}

Create a website using HTML, CSS, JS.

Structure:
index.html
style.css
script.js

USER REQUEST:
${prompt}
`;
    }

    console.log("🚀 Prompt:", dynamicPrompt);

    // 🔥 STEP 4: AI CALL
    let raw = "";
    let parsed = null;

    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(dynamicPrompt);

      try {
        parsed = await extractJson(raw);
      } catch (err) {
        console.log("Parse error:", err);
      }

      if (!parsed) {
        raw = await generateResponse(dynamicPrompt + "\nRETURN ONLY JSON.");
        try {
          parsed = await extractJson(raw);
        } catch {}
      }
    }

    if (!parsed || !parsed.files) {
      return res.status(400).json({
        message: "AI returned invalid response"
      });
    }

    // 🔥 STEP 5: SAVE DATA
    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 60),
      latestCode: JSON.stringify(parsed.files),
      conversation: [
        { role: "user", content: prompt },
        { role: "ai", content: parsed.message || "Generated" }
      ]
    });

    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      websiteId: website._id,
      files: parsed.files,
      remainingCredits: user.credits
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Generate website server error"
    });
  }
};