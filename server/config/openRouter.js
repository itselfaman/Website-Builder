const openRouterUrl =
  "https://openrouter.ai/api/v1/chat/completions";

const model =
  "deepseek/deepseek-chat";

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
                  "Return ONLY raw valid JSON.",
              },

              {
                role: "user",

                content: prompt,
              },
            ],

            temperature: 0.2,

            max_tokens: 1200,
          }),
        }
      );

      const data =
        await res.json();

      console.log(
        "OPENROUTER RESPONSE:"
      );

      console.log(data);

      if (
        !data?.choices?.[0]
          ?.message?.content
      ) {

        throw new Error(
          "Empty AI response"
        );
      }

      return data.choices[0]
        .message.content;

    } catch (err) {

      console.log(
        "OPENROUTER ERROR:",
        err
      );

      throw err;
    }
  };