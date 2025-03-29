const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  const message = req.body.message;
  const history = req.body.history || [];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          ...history,
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    console.log("Модель:", data.model); // ← Логирование используемой модели
    res.json({ reply: data.choices?.[0]?.message?.content || "Ошибка: нет ответа от модели" });

  } catch (error) {
    console.error('Ошибка при обращении к OpenAI API:', error);
    res.status(500).json({ error: 'Ошибка при получении ответа от модели' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
