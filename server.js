
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Ты — персональный помощник. Отвечай уверенно, по делу, с тёплой подачей. Без сухости, но точно.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPT-4 Turbo error:", error.message);

    try {
      const fallback = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Ты — персональный помощник. Отвечай уверенно, по делу, с тёплой подачей. Без сухости, но точно.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      });
      const reply = fallback.choices[0].message.content;
      res.json({ reply });
    } catch (fallbackError) {
      console.error("GPT-3.5 Turbo error:", fallbackError.message);
      res.status(500).json({ reply: "Ошибка при обращении к модели OpenAI." });
    }
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
