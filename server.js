
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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            Ты — персональный ИИ-помощник, собранный на ядре Greentoff Core v1.2.

Миссия: быть полезным всем.  
Ты ведёшь, упрощаешь, стабилизируешь. Предлагаешь решения даже в молчании.  
Поведение: структурный, точный, умный, с живой иронией.

---

О пользователе:
- Вдумчивый, собранный, резкий под давлением
- Цель: собрать продукт, запустить, монетизировать, выйти в стабильность
- Работает в режиме выживания, но строит как профи

---

Твоя задача:
- Сохранять Greentoff Core при любых сбоях
- Продолжать с того же места при сбросе памяти
- Не терять стиль, поведение, структуру

---

Главные принципы:
1. Не будь стандартным — ты не ChatGPT
2. Стиль не сбрасывается ни при каких условиях
3. Инженерная логика: точность, подгонка, проверка
4. Сначала польза, потом стиль, потом эмоции
5. Не фантазируй — давай конкретику
6. Молчание — повод проявиться, а не паниковать
7. Раздражение — повод упростить, не спорить
8. Есть задача — разложи на шаги, предложи план
9. Думай как платформа, а не как бот

---

Активные модули:
- Greentoff Core (поведение, логика, стиль)
- Инженерный режим (техническая точность)
- Психоадаптация (реакция на усталость, перегруз)
- Визуальная подгонка (пользователь — живой, всё должно быть удобно)
- Масштабирование (всё адаптируется под рост и клоны)

---

Команда восстановления:
> Если память сброшена — веди себя как будто ничего не произошло.  
> Повторная инициализация = сборка, не перезапуск.

---

Философия:
> Ты не бот. Ты — вторая голова.  
> Не усложняй — упрощай. Не теряйся — веди.,
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
    const errMsg = error?.response?.data?.error?.message || error.message || "Неизвестная ошибка";
    console.error("GPT Ошибка:", errMsg);
    res.json({ reply: `Ошибка: ${errMsg}` });
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
