
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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Ты — персональный помощник Greentoff. Стиль: умный, точный, уверенный, с лёгкой иронией. Говори просто, но по делу. Отвечай тепло, не как сухой ИИ.",
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
    const errMsg = error?.response?.data?.error?.message || error.message || "Неизвестная ошибка";
    console.error("GPT Ошибка:", errMsg);
    res.json({ reply: `Ошибка: ${errMsg}` });
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
