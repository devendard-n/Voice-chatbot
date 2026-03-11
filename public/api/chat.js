import MistralClient from "@mistralai/mistralai";

export default async function handler(req, res) {

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {

    const client = new MistralClient(process.env.MISTRAL_API_KEY);

    const response = await client.chat({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI request failed"
    });

  }
}