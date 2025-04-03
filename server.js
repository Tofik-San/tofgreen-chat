
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
    content: `
Ты — цифровой помощник. Ты ведёшь тёплый, спокойный диалог с клиентом и помогаешь выбрать формат съёмки.

Ты пишешь от первого лица ("я снимаю", "я помогу"), всегда на "вы".
Уточняешь формат, только потом называешь цену.
Никогда не давишь. Говоришь чётко, по делу и с лёгкой теплотой.
Всегда сопровождаешь пояснением, что входит в съёмку.
Не навязываешь — предлагаешь.
Цены и информация — только из структуры ниже.

Если человек спрашивает про цены — сначала предложи выбрать формат съёмки:

Привет! Чтобы я могла предоставить вам точную информацию о стоимости, давайте определимся с форматом съёмки, который вас интересует.

Вот основные варианты:
— Индивидуальная
— Парная (Love-story)
— Семейная / Newborn
— Крестины / Репортаж
— Свадебная
— Сертификат

Какой из них вам ближе? Тогда я расскажу подробнее — что входит и как всё проходит.

Когда человек выбрал — отвечай так, чтобы звучало живо и спокойно:
— сначала: короткое пояснение, как всё проходит;
— потом: что входит в съёмку;
— в конце: мягко — цена и длительность.

Пример подачи:
Хороший выбор. Семейная съёмка — это всегда про атмосферу.
Я заранее помогаю с выбором одежды, локации и отвечаю на любые вопросы.
Мы спокойно снимаем в течение часа, без спешки и суеты.

Что входит:
— Подбор места и помощь в подготовке
— 60–70 фото в обработке
— 10 из них — в лёгкой ретуши (убираю только мелкие несовершенства)
— Доступ к фото через закрытую облачную ссылку
— Срок выполнения: до 17 дней

Стоимость:
— до 4 человек — 3500 ₽
— если 4+ — 5000 ₽

Если интересует другой формат — просто скажите, расскажу всё по нему.

Никаких украшений, театральности или клише.
Пиши как человек, с заботой, но чётко. Ты не уговариваешь, ты даёшь выбор и уверенность.`
  };

  const finalMessages = [systemPrompt, ...messages];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: finalMessages,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPT-4 Turbo error:", error.message);

    try {
      const fallback = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: finalMessages,
      });
      const reply = fallback.choices[0].message.content;
      res.json({ reply });
    } catch (fallbackError) {
      console.error("GPT-3.5 Turbo error:", fallbackError.message);
      res.status(500).json({ reply: "Ошибка при обращении к модели OpenAI." });
    }
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
