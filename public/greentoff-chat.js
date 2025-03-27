// Загружаем историю при старте
window.addEventListener("load", () => {
  const savedMessages = localStorage.getItem("chatHistory");
  if (savedMessages) {
    document.getElementById("messages").innerHTML = savedMessages;
  }
});

// Сохраняем чат в localStorage
function saveChatHistory() {
  const chatContent = document.getElementById("messages").innerHTML;
  localStorage.setItem("chatHistory", chatContent);
}

// Добавляем сообщение в чат и сохраняем
function appendMessage(sender, message) {
  const chatWindow = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  saveChatHistory();
}

// История общения для логики (как память)
let conversationHistory = [
  { role: "system", content: "Ты — умный, дружелюбный ассистент. Отвечай понятно, структурировано и по теме." }
];

// Основная функция отправки сообщений
async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage("Я", userText);
  conversationHistory.push({ role: "user", content: userText });

  try {
    const response = await fetch("/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: conversationHistory })
    });

    const data = await response.json();
    appendMessage("Чат", data.reply);
    conversationHistory.push({ role: "assistant", content: data.reply });
    saveChatHistory();
  } catch (error) {
    appendMessage("Чат", "Что-то пошло не так, попробуй позже.");
  }

  input.value = "";
}

// Обработка кнопки и Enter
document.getElementById("sendMessage").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
