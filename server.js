const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

const configuration = new OpenAI.Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI.OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("Получено сообщение:", userMessage);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Ошибка при обращении к OpenAI:", error.message);
    res.status(500).json({ reply: "Произошла ошибка при получении ответа от ИИ." });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});