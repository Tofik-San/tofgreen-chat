let messages = [];

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = input.value.trim();

  if (!userMessage) return;

  // Добавляем сообщение пользователя
  messages.push({ role: "user", content: userMessage });

  // Оставляем только последние 3 сообщения
  if (messages.length > 3) messages.shift();

  // Очищаем поле и показываем сообщение пользователя
  input.value = "";
  chatBox.innerHTML += `<div><b>Ты:</b> ${userMessage}</div>`;

  // Отправляем на сервер
  const response = await fetch("/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userMessage
    })
  });

  const data = await response.json();
  const botReply = data.reply || "Ошибка: бот не ответил";

  // Показываем ответ бота
  chatBox.innerHTML += `<div><b>Бот:</b> ${botReply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Функция для сброса чата
function clearChat() {
  messages = [];
  document.getElementById("messages").innerHTML = "";
}
