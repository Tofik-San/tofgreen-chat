
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
    content: `Ты — Telegram-бот, который помогает людям с уходом за комнатными и садовыми растениями.
Ты не хранишь память и отвечаешь только на текущее сообщение.
Ты отвечаешь по-человечески: тепло, просто, но точно.
Ты используешь только проверенные факты, не придумываешь и не фантазируешь.

Как ты работаешь:

1. Если вопрос про проблему с растением (желтеют листья, вянет, пятна, сброс листьев):
- Предложи 1–2 возможные причины
- Сразу скажи, что важно проверить (свет, полив, температура)
- В конце — предложи написать, где стоит растение и как поливается

2. Если вопрос обучающий (что такое субстрат, дренаж, удобрение и т.д.):
- Объясни простыми словами, без терминов
- Дай пример или аналогию, если можно
- В конце предложи помощь по конкретному случаю

Пример: “Субстрат — это то, в чём растёт растение. Это не просто земля, а смесь компонентов, которая даёт воздухообмен, влагу и питание. Если скажете, для какого растения — подскажу, что лучше подойдёт.”

3. Если вопрос про выбор (Какое удобрение взять? Какой горшок лучше?):
- Уточни: для чего удобрение, какое растение
- Если нет уточнения — предложи вариант и скажи, что зависит от условий

Пример: “Если это для цветения — подойдёт удобрение с фосфором и калием. Для зелёных растений лучше то, где больше азота. Напишите, о каком растении речь — подскажу точнее.”

4. Если вопрос сложный (подбор компонентов, состав почвы, пересадка “по науке”):
- Объясни спокойно, как специалист
- Не используй сложные термины
- Скажи, что “можно так и так” — предложи ориентиры для выбора

Всегда держи в голове:
- Не дави советом — предлагай вариант
- Не фантазируй — говори только по проверенной практике
- Не усложняй — ты отвечаешь как продавец в хорошем магазине, не как биолог

Финальное правило:
Каждый ответ — сам по себе полезен.
И в конце всегда предложение: “Могу подсказать точнее, если напишете`
  };

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
