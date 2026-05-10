const openRouterUrl =
  "https://openrouter.ai/api/v1/chat/completions";

const model =
  "deepseek/deepseek-chat";

export const generateResponse = async (
  prompt
) => {

  try {

    const res = await fetch(
      openRouterUrl,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          model,

          response_format: {
            type: "json_object",
          },

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

          max_tokens: 4000,
        }),
      }
    );

    if (!res.ok) {

      const err = await res.text();

      console.log(err);

      throw new Error(
        "OpenRouter Error"
      );
    }

    const data = await res.json();

    console.log(
      "OPENROUTER RESPONSE:"
    );

    console.log(data);

    return data.choices?.[0]
      ?.message?.content;

  } catch (err) {

    console.log(
      "OPENROUTER ERROR:",
      err
    );

    return null;
  }
};