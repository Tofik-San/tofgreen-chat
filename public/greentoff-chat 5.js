// Greentoff Chat JS
// Поддержка истории (3 пары сообщений), сброса, прокрутки и гибкости под будущее

let messages = [];

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("messages");
  const userMessage = input.value.trim();

  if (!userMessage) return;

  // Добавляем сообщение пользователя
  messages.push({ role: "user", content: userMessage });

  // Очищаем поле ввода и отображаем сообщение
  input.value = "";
  chatBox.innerHTML += `<div class="user-msg"><b>Ты:</b> ${userMessage}</div>`;

  // Отправляем массив сообщений на сервер
  const response = await fetch("/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: messages })
  });

  const data = await response.json();
  const botReply = data.reply || "Ошибка: бот не ответил";

  // Отображаем ответ
  chatBox.innerHTML += `<div class="bot-msg"><b>Бот:</b> ${botReply}</div>`;

  // Сохраняем ответ в массив
  messages.push({ role: "assistant", content: botReply });

  // Обрезаем массив до 6 последних сообщений (3 пары)
  if (messages.length > 6) {
    messages = messages.slice(-6);
  }

  // Автопрокрутка вниз
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Полный сброс истории
function clearChat() {
  messages = [];
  document.getElementById("messages").innerHTML = "";
}
