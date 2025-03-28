const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });
    res.json({ reply: completion.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Ошибка OpenAI:", error.message);
    res.status(500).json({ reply: "Произошла ошибка на сервере." });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
