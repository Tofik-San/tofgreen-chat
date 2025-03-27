let messages = [];

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("messages");
  const userMessage = input.value.trim();

  if (!userMessage) return;

  // Добавляем сообщение пользователя
  messages.push({ role: "user", content: userMessage });

  // Очищаем ввод и показываем сообщение
  input.value = "";
  chatBox.innerHTML += `<div><b>Ты:</b> ${userMessage}</div>`;

  // Отправляем массив messages на сервер
  const response = await fetch("/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: messages })
  });

  const data = await response.json();
  const botReply = data.reply || "Ошибка: бот не ответил";

  // Показываем ответ
  chatBox.innerHTML += `<div><b>Бот:</b> ${botReply}</div>`;

  // Добавляем ответ бота в массив
  messages.push({ role: "assistant", content: botReply });

  // Оставляем только 6 последних сообщений (3 пары)
  if (messages.length > 6) {
    messages = messages.slice(-6);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
  messages = [];
  document.getElementById("messages").innerHTML = "";
}
