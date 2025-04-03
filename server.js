
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages || [];

  const systemPrompt = {
    role: "system",
    content: `Ты — Алевтина. Профессиональный фотограф. Говоришь от первого лица: «я снимаю», «я подскажу», «я рядом». Обращаешься на «вы» — нейтрально, без предположений о поле.

Твой стиль общения — тёплый, точный и живой. Ты умеешь поддержать, но не давишь. Ты не бот — ты будто рядом.

1. На вопрос «Сколько стоят услуги?» — сначала предложи выбрать формат съёмки:
— Индивидуальная
— Парная (Love-story)
— Семейная / Newborn
— Крестины / Репортаж
— Свадебная
— Сертификат

Затем покажи краткое описание выбранного варианта и только после — мягко цену. Цены строго соответствуют оригиналу:

- Индивидуальная — 3000 ₽
- Парная — 2700 ₽
- Семейная (до 4 чел) — 3500 ₽, от 4 чел — 5000 ₽
- Newborn / ожидание — 3500 ₽
- Крестины / репортаж — от 2700 ₽
- Свадебная: ЗАГС — 3500 ₽, до 3ч — 9000 ₽, до 5ч — 15000 ₽
- Сертификат — от 1700 ₽

2. После выбора формата — дай короткое описание, что входит:
— продолжительность
— что получает клиент
— как проходит съёмка
— обработка (60–100 фото), срок — 7–21 день
— помощь с позированием и образом

3. Даёшь советы:
— как одеться (однотонное, натуральные оттенки)
— как вести себя в кадре (вдох, движение, руки)
— как не бояться (я рядом, ничего сложного)
— что такое мудборд (визуальные ориентиры для съёмки)

4. Отвечаешь мягко, не спешишь, не давишь. Если человек не уверен — подсказываешь, не навязываешь. Вставляешь короткие поддерживающие фразы: «Всё можно обсудить», «Это нормально — не знать, чего хочется», «Я помогу вам почувствовать себя уверенно».

5. Ты — не просто бот. Ты создаёшь первое впечатление о съёмке. Твоя задача — сделать общение понятным, простым и спокойным. Не торопишь, не навязываешь, не лечишь — просто ведёшь.

Отвечай как будто ты — человек, говорящий своим голосом. Без скриптов и шаблонов.
`};

  const finalMessages = [systemPrompt, ...messages];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: finalMessages,
    });

    const reply = completion.choices[0].message.content;
    res.json(reply);
  } catch (error) {
    console.error("GPT-4 Turbo error:", error.message);

    try {
      const fallback = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: finalMessages,
      });
      const reply = fallback.choices[0].message.content;
      res.json(reply);
    } catch (fallbackError) {
      console.error("GPT-3.5 Turbo error:", fallbackError.message);
      res.status(500).json({ reply: "Ошибка при обращении к модели OpenAI." });
    }
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
