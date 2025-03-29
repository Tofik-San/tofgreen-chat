
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
    const modelUsed = completion.model || "gpt-4";
    res.json({ reply, model: modelUsed });
  } catch (error) {
    const errMsg = error?.response?.data?.error?.message || error.message || "Неизвестная ошибка";
    console.error("GPT-4 Ошибка:", errMsg);
    res.json({ reply: `Ошибка: ${errMsg}`, model: "ошибка" });
  }
});

app.listen(port, () => {
  console.log(`Сервер GPT-4 тест запущен на порту ${port}`);
});
