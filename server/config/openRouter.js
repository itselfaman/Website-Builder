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
            },

            body: JSON.stringify({

              model:
                "meta-llama/llama-3.1-8b-instruct:free",

              messages: [

                {
                  role: "system",

                  content:
                    "Return ONLY valid JSON.",
                },

                {
                  role: "user",

                  content: prompt,
                },
              ],

              temperature: 0.2,

              max_tokens: 1500,
            }),
          }
        );

      const text =
        await response.text();

      console.log(
        "RAW RESPONSE:"
      );

      console.log(text);

      if (!text) {
        return null;
      }

      const data =
        JSON.parse(text);

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