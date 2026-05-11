const openRouterUrl =
  "https://openrouter.ai/api/v1/chat/completions";

const model =
  "mistralai/mistral-7b-instruct";

export const generateResponse =
  async (prompt) => {

    try {

      console.log(
        "API KEY:",
        process.env.OPENROUTER_API_KEY
          ? "FOUND"
          : "MISSING"
      );

      const res = await fetch(
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

            model,

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

            temperature: 0.2,

            max_tokens: 2000,
          }),
        }
      );

      const text =
        await res.text();

      console.log(
        "RAW OPENROUTER RESPONSE:"
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