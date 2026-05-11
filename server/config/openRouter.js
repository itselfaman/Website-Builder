const openRouterUrl =
  "https://openrouter.ai/api/v1/chat/completions";

// const model =
//   "deepseek/deepseek-chat";
const model =
  "mistralai/mistral-7b-instruct";

export const generateResponse =
  async (prompt) => {

    try {

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
                  "Return ONLY valid JSON. No markdown. No explanation. No backticks.",
              },

              {
                role: "user",
                content: prompt,
              },
            ],

            temperature: 0.3,

            max_tokens: 2500,
          }),
        }
      );

      if (!res.ok) {

        const err =
          await res.text();

        console.log(
          "OPENROUTER ERROR:"
        );

        console.log(err);

        return null;
      }

      const data =
        await res.json();

      console.log(
        "OPENROUTER RESPONSE:"
      );

      console.log(data);

      return data
        ?.choices?.[0]
        ?.message?.content;

    } catch (err) {

      console.log(
        "FETCH ERROR:",
        err
      );

      return null;
    }
  };