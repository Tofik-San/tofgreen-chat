const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/proxy", async (req, res) => {
  const messages = req.body.message;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ reply: "Ошибка: API ключ не найден" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "Ты — умный, но спокойный AI-помощник Greentoff. Ты говоришь просто и понятно." },
          ...messages
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "Ошибка: нет ответа от модели" });

  } catch (error) {
    res.json({ reply: "Ошибка при подключении к OpenAI" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
