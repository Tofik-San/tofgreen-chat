import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  try {
    const messages = req.body.messages;
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });
    res.json(chat.choices[0].message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при обращении к OpenAI');
  }
});

app.listen(8080, () => {
  console.log('Сервер запущен на порту 8080');
});
