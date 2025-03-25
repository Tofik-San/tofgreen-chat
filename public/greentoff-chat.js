<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>GreenToff AI Чат</title>
  <script src="greentoff-chat.js" defer></script>
  <style>
    body { font-family: sans-serif; background: #f0f0f0; padding: 20px; }
    #chat { max-width: 600px; margin: auto; }
    #messages { min-height: 300px; background: #fff; padding: 10px; border: 1px solid #ccc; margin-bottom: 10px; white-space: pre-wrap; }
    input { width: 80%; padding: 10px; }
    button { padding: 10px 20px; }
  </style>
</head>
<body>
  <div id="chat">
    <div id="messages">Привет! Напиши мне что-нибудь...</div>
    <input id="userInput" type="text" placeholder="Введите сообщение...">
    <button>Отправить</button>
  </div>
</body>
</html>
