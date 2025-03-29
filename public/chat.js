let messages = [];

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("messages");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  messages.push({ role: "user", content: userMessage });
  input.value = "";
  chatBox.innerHTML += `<div class="message user">${userMessage}</div>`;

  try {
    const response = await fetch("/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messages }),
    });
    const data = await response.json();
    const botReply = data.reply || "Бот не ответил.";
    chatBox.innerHTML += `<div class="message bot">${botReply}</div>`;
    messages.push({ role: "assistant", content: botReply });
    if (messages.length > 6) messages = messages.slice(-6);
  } catch (err) {
    chatBox.innerHTML += '<div class="message bot">Ошибка: Не удалось получить ответ от сервера.</div>';
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
  messages = [];
  document.getElementById("messages").innerHTML = "";
}