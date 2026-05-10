const openRouterUrl =
  "https://openrouter.ai/api/v1/chat/completions";

const model =
  "deepseek/deepseek-chat-v3-0324:free";

export const generateResponse = async (prompt) => {

  try {

    const res = await fetch(openRouterUrl, {

      method: "POST",

      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        model: model,

        messages: [

          {
            role: "system",

            content: `
You are an AI website generator.

Return ONLY valid raw JSON.

DO NOT:
- use markdown
- use triple backticks
- explain anything
- write extra text

RESPONSE FORMAT:

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
`,
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,

        max_tokens: 4000,
      }),
    });

    // ============================================
    // ERROR HANDLING
    // ============================================
    if (!res.ok) {

      const err = await res.text();

      console.log("OPENROUTER ERROR:");
      console.log(err);

      throw new Error("OpenRouter request failed");
    }

    // ============================================
    // RESPONSE
    // ============================================
    const data = await res.json();

    console.log("FULL OPENROUTER RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    const text =
      data?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("No AI response");
    }

    return text;

  } catch (err) {

    console.log("OPENROUTER CATCH ERROR:");
    console.log(err);

    return null;
  }
};