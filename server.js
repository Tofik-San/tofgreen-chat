const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 8080;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const message = req.body.message;
  const history = req.body.history || [];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [...history, { role: 'user', content: message }]
    });

    const botReply = response.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Что-то пошло не так...' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
