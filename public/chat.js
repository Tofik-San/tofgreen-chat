
let messages = [];

async function sendMessage() {
  const input = document.getElementById("input");
  const chatBox = document.getElementById("chat");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  messages.push({ role: "user", content: userMessage });
  input.value = "";
  chatBox.innerHTML += `<div class="chat-bubble user">${userMessage}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messages }),
    });
    const data = await response.json();
    const botReply = data.reply || "Бот не ответил.";
    chatBox.innerHTML += `<div class="chat-bubble bot">${botReply}</div>`;
    messages.push({ role: "assistant", content: botReply });
    if (messages.length > 6) messages = messages.slice(-6);
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    chatBox.innerHTML += `<div class="chat-bubble bot">Ошибка: Не удалось получить ответ от сервера.</div>`;
  }
}
