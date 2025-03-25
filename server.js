const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/proxy', async (req, res) => {
    const userMessage = req.body.message;
    const apiKey = process.env.OPENAI_API_KEY;const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${y}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userMessage }]
  })
});

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.json({ reply: "Ошибка при подключении к OpenAI" });
    }
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
