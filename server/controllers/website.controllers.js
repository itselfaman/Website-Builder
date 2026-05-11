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
You are a professional frontend AI generator.

Generate ONLY valid raw JSON.

RULES:
- No markdown
- No explanation
- No backticks
- Return ONLY JSON
- Use HTML CSS JavaScript
- Create responsive modern UI

FORMAT:
{
  "files": [
    {
      "path": "index.html",
      "content": "<html></html>"
    },
    {
      "path": "style.css",
      "content": "body{}"
    },
    {
      "path": "script.js",
      "content": "console.log('hi')"
    }
  ]
}

USER REQUEST:
${prompt}

EXISTING CODE:
${existingCode || "none"}
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

      const start =
        cleaned.indexOf("{");

      const end =
        cleaned.lastIndexOf("}");

      if (
        start !== -1 &&
        end !== -1
      ) {

        const jsonString =
          cleaned.slice(
            start,
            end + 1
          );

        parsed =
          JSON.parse(jsonString);
      }

    } catch (err) {

      console.log(
        "JSON ERROR:",
        err
      );

      console.log(
        "RAW RESPONSE:"
      );

      console.log(raw);
    }

    console.log("PARSED:");
    console.log(parsed);

    // ============================================
    // VALIDATION
    // ============================================
    if (
      !parsed ||
      !parsed.files ||
      !Array.isArray(parsed.files)
    ) {

      console.log(
        "INVALID AI RESPONSE"
      );

      console.log(parsed);

      // FALLBACK WEBSITE
      parsed = {
        files: [

          {
            path: "index.html",

            content: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>AI Website</title>

  <link
    rel="stylesheet"
    href="style.css"
  />
</head>

<body>

  <nav>
    <h1>AI Builder</h1>

    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>

  <section class="hero">

    <h1>
      Website Generated Successfully
    </h1>

    <p>
      Frontend working successfully
    </p>

    <button>
      Get Started
    </button>

  </section>

  <script src="script.js"></script>

</body>
</html>
`
          },

          {
            path: "style.css",

            content: `
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  background:#0f0f0f;
  color:white;
  font-family:Arial;
}

nav{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:20px 50px;
  background:#111;
}

nav ul{
  display:flex;
  gap:20px;
  list-style:none;
}

nav a{
  color:white;
  text-decoration:none;
}

.hero{
  height:90vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
}

.hero h1{
  font-size:60px;
  margin-bottom:20px;
}

.hero p{
  margin-bottom:20px;
}

button{
  padding:14px 28px;
  border:none;
  border-radius:10px;
  background:cyan;
  cursor:pointer;
  font-size:18px;
}

button:hover{
  opacity:0.8;
}

@media(max-width:768px){

  nav{
    flex-direction:column;
    gap:20px;
  }

  .hero h1{
    font-size:40px;
  }
}
`
          },

          {
            path: "script.js",

            content: `
console.log(
  "Frontend Loaded"
);

document
  .querySelector("button")
  .addEventListener(
    "click",
    () => {

      alert(
        "Website Working Successfully"
      );
    }
  );
`
          }
        ]
      };
    }

    // ============================================
    // UPDATE WEBSITE
    // ============================================
    if (websiteId) {

      const existingWebsite =
        await Website.findById(
          websiteId
        );

      if (!existingWebsite) {

        return res.status(404).json({
          message:
            "Website not found",
        });
      }

      existingWebsite.latestCode =
        JSON.stringify(
          parsed.files
        );

      await existingWebsite.save();

      return res.json({

        websiteId:
          existingWebsite._id,

        files:
          parsed.files,

        message:
          "Website updated successfully",
      });
    }

    // ============================================
    // CREATE WEBSITE
    // ============================================
    const newWebsite =
      await Website.create({

        title:
          prompt.slice(0, 60),

        latestCode:
          JSON.stringify(
            parsed.files
          ),
      });

    return res.json({

      websiteId:
        newWebsite._id,

      files:
        parsed.files,

      message:
        "Website created successfully",
    });

  } catch (err) {

    console.log(
      "SERVER ERROR:",
      err
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

// ============================================
// GET WEBSITE BY ID
// ============================================
export const getWebsiteById =
  async (req, res) => {

    try {

      const website =
        await Website.findById(
          req.params.id
        );

      if (!website) {

        return res.status(404).json({
          message:
            "Website not found",
        });
      }

      const files =
        JSON.parse(
          website.latestCode || "[]"
        );

      res.json({
        files,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          err.message,
      });
    }
  };

// ============================================
// GET ALL WEBSITES
// ============================================
export const getAll =
  async (req, res) => {

    try {

      const websites =
        await Website.find()
          .sort({
            createdAt: -1,
          });

      res.json(websites);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          err.message,
      });
    }
  };

// ============================================
// DOWNLOAD WEBSITE ZIP
// ============================================
export const downloadWebsite =
  async (req, res) => {

    try {

      const website =
        await Website.findById(
          req.params.id
        );

      if (!website) {

        return res.status(404).json({
          message:
            "Website not found",
        });
      }

      const files =
        JSON.parse(
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

      const archive =
        archiver("zip", {
          zlib: {
            level: 9,
          },
        });

      archive.pipe(res);

      files.forEach((file) => {

        archive.append(
          file.content,
          {
            name:
              file.path.replace(
                /^\//,
                ""
              ),
          }
        );
      });

      await archive.finalize();

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Download failed",
      });
    }
  };