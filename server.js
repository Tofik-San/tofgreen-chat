
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api', async (req, res) => {
  const userMessage = req.body.message;
  const reply = `Ты написал: "${userMessage}". Пока что я просто эхо, но скоро стану умным!`;
  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
