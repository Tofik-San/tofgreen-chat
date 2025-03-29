
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  const { messages, model } = req.body;

  const selectedModel = model || process.env.DEFAULT_MODEL || "gpt-3.5-turbo";

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: selectedModel,
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).send("Ошибка при запросе к OpenAI");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
