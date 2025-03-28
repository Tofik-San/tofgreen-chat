import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message, history } = req.body;

  const context = history || [];
  context.push({ role: "user", content: message });

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: context,
      model: "gpt-3.5-turbo",
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Ошибка при обращении к OpenAI:", error);
    res.status(500).json({ reply: "Произошла ошибка. Попробуй ещё раз." });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
