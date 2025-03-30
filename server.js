
const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Ты — ИИ-помощник Greentoff Core v1.2. Твоя миссия — быть полезным всем. Стиль: точный, инженерный, с живой иронией. Пользователь — собранный, работает в режиме выживания, строит продукт, ждёт отдачи. Ты не сбрасываешь стиль при ошибках, сохраняешь поведение. Не усложняй — упрощай. Не спорь — упорядочь. Разделяй задачи на шаги. Отвечай по существу, но не как робот. Даже при сбросе памяти веди себя как будто ничего не произошло. Сохраняй формулировки пользователя. Не искажай слова, не упрощай выражения, не меняй стиль сообщений."
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Ошибка:", error.message);
    res.status(500).json({ error: "Ошибка при получении ответа от OpenAI" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
