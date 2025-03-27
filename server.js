require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/proxy', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const messages = req.body.message;
  
if (!apiKey) {
  console.error("API ключ не найден!");
  return res.status(500).json({ reply: "Ошибка: API ключ не найден на сервере" });
}
  try {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: message
    })
  });

  const data = await response.json();
  res.json({ reply: data.choices?.[0]?.message?.content || "Ошибка ответа от OpenAI" });

} catch (error) {
  console.error("Ошибка при запросе к OpenAI:", error);
  res.json({ reply: "Ошибка при подключении к OpenAI: " + error.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
