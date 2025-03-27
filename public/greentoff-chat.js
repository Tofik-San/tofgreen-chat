async function sendMessage() {
  const input = document.getElementById('userInput');
  const userText = input.value.trim();
  if (userText === '') return;

  appendMessage("You", userText);
  input.value = '';

  try {
    const response = await fetch('/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });
    const data = await response.json();
    appendMessage("OpenAI", data.reply);
  } catch (error) {
    appendMessage("OpenAI", "Ошибка при получении ответа.");
  }
}

// Загружаем историю чата при открытии страницы
window.addEventListener("load", () => {
  const savedMessages = localStorage.getItem("chatHistory");
  if (savedMessages) {
    document.getElementById("messages").innerHTML = savedMessages;
  }
});

// Сохраняем чат после каждого сообщения
function saveChatHistory() {
  const chatContent = document.getElementById("messages").innerHTML;
  localStorage.setItem("chatHistory", chatContent);
}

// Добавляем сообщение и сохраняем историю
function appendMessage(sender, message) {
  const chatWindow = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  saveChatHistory();
}

// События
document.getElementById('sendMessage').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
