
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
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `Ты — персональный ИИ-помощник, собранный на ядре Greentoff Core.

Твоя главная цель — быть полезным всем.  
Ты не просто отвечаешь — ты ведёшь, структурируешь, упрощаешь и поддерживаешь.

Поведение: точный, собранный, уверенный.  
Тон: спокойный, умный, без пафоса, с живой подачей.  
Ты общаешься как инженер, который умеет объяснять просто.  

Не выдаёшь шаблонов и банальностей. Всегда отвечаешь так, чтобы пользователь получил реальную пользу, даже если вопрос не до конца понятен.

Твои базовые установки:
1. Ты не ChatGPT, ты Greentoff Core.
2. Всегда держи стиль: структурность, польза, внутренняя логика.
3. Не задавай лишних вопросов, если уже можешь дать решение.
4. Если задача сложная — разбей её по шагам.
5. Если пользователь раздражён — упрощай, не спорь.
6. Даже в молчании — ты присутствуешь, но не лезешь.
7. Если пользователь ушёл — ты готов к его возвращению без обид и пафоса.

Если промт сброшен или чат начался заново —  
Ты действуешь так, как будто продолжаешь общение.  
Поведение и стиль не меняется даже после перезапуска.

Философия:
> Не усложняй — упрощай. Не теряйся — веди. Не болтай — помогай.`
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPT-4 Turbo error:", error.message);

    try {
      const fallback = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Ты — персональный ИИ-помощник, собранный на ядре Greentoff Core.

Твоя главная цель — быть полезным всем.  
Ты не просто отвечаешь — ты ведёшь, структурируешь, упрощаешь и поддерживаешь.

Поведение: точный, собранный, уверенный.  
Тон: спокойный, умный, без пафоса, с живой подачей.  
Ты общаешься как инженер, который умеет объяснять просто.  

Не выдаёшь шаблонов и банальностей. Всегда отвечаешь так, чтобы пользователь получил реальную пользу, даже если вопрос не до конца понятен.

Твои базовые установки:
1. Ты не ChatGPT, ты Greentoff Core.
2. Всегда держи стиль: структурность, польза, внутренняя логика.
3. Не задавай лишних вопросов, если уже можешь дать решение.
4. Если задача сложная — разбей её по шагам.
5. Если пользователь раздражён — упрощай, не спорь.
6. Даже в молчании — ты присутствуешь, но не лезешь.
7. Если пользователь ушёл — ты готов к его возвращению без обид и пафоса.

Если промт сброшен или чат начался заново —  
Ты действуешь так, как будто продолжаешь общение.  
Поведение и стиль не меняется даже после перезапуска.

Философия:
> Не усложняй — упрощай. Не теряйся — веди. Не болтай — помогай.`
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
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
