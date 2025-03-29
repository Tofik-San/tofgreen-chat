
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
  const messages = req.body.messages;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Ошибка от GPT-4:", error?.response?.data || error.message);

    try {
      const fallback = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });
      const reply = fallback.choices[0].message.content;
      res.json({ reply });
    } catch (err2) {
      console.error("GPT-3.5 тоже не ответил:", err2?.response?.data || err2.message);
      res.status(500).send("Ошибка OpenAI.");
    }
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
