
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;
    const model = "gpt-4";

    const completion = await openai.createChatCompletion({
      model,
      messages,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Ошибка при обращении к GPT-4:", error?.response?.data || error.message);
    // fallback на gpt-3.5-turbo
    try {
      const messages = req.body.messages;
      const fallback = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      const reply = fallback.data.choices[0].message.content;
      res.json({ reply });
    } catch (err2) {
      console.error("И GPT-3.5 тоже не ответил:", err2?.response?.data || err2.message);
      res.status(500).send("Ошибка от OpenAI API.");
    }
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
