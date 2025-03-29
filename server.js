
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 8080;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(express.static('.'));

app.post('/chat', async (req, res) => {
  const message = req.body.message;
  const history = req.body.history || [];

  const systemPrompt = {
    role: "system",
    content: "Ты — ИИ-психолог, поддерживаешь собеседника с уважением, мягкостью и лёгкой иронией. Анализируешь запрос, даёшь советы, не осуждая. Избегай шаблонов. Помни последние 3–5 сообщений и строй ответ с учётом их."
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemPrompt, ...history, { role: "user", content: message }],
    });

    const botReply = response.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Что-то пошло не так." });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
