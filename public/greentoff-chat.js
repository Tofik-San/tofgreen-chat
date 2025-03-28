let messages = [];

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("messages");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  messages.push({ role: "user", content: userMessage });

  input.value = "";
  chatBox.innerHTML += `<div class="user-msg"><b>Ты:</b> ${userMessage}</div>`;

  const response = await fetch("/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: messages })
  });

  const data = await response.json();
  const botReply = data.reply || "Ошибка: бот не ответил";

  chatBox.innerHTML += `<div class="bot-msg"><b>Бот:</b> ${botReply}</div>`;
  messages.push({ role: "assistant", content: botReply });

  if (messages.length > 6) {
    messages = messages.slice(-6);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
  messages = [];
  document.getElementById("messages").innerHTML = "";
}
