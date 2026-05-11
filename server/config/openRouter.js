const openRouterUrl =
  "https://openrouter.ai/api/v1/chat/completions";

export const generateResponse =
  async (prompt) => {

    try {

      const response =
        await fetch(
          openRouterUrl,
          {
            method: "POST",

            headers: {

              Authorization:
                `Bearer ${process.env.OPENROUTER_API_KEY}`,

              "Content-Type":
                "application/json",

              "HTTP-Referer":
                "https://genweb-ai.onrender.com",

              "X-Title":
                "Genweb AI",
            },

            body: JSON.stringify({

              model:
                "openai/gpt-3.5-turbo",

              messages: [

                {
                  role: "system",

                  content:
                    "Return ONLY valid JSON. No markdown. No explanation.",
                },

                {
                  role: "user",

                  content: prompt,
                },
              ],

              temperature: 0.3,

              max_tokens: 2000,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "OPENROUTER RESPONSE:"
      );

      console.log(data);

      return data
        ?.choices?.[0]
        ?.message?.content || null;

    } catch (err) {

      console.log(
        "OPENROUTER ERROR:"
      );

      console.log(err);

      return null;
    }
  };