let messages = [];

async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("messages");
  const userMessage = input.value.trim();

  if (!userMessage) return;

  messages.push({ role: "user", content: userMessage });
  if (messages.length > 3) messages.shift();

  input.value = "";
  chatBox.innerHTML += `<div><b>Ты:</b> ${userMessage}</div>`;

  const response = await fetch("/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage })
  });

  const data = await response.json();
  const botReply = data.reply || "Ошибка: бот не ответил";

  chatBox.innerHTML += `<div><b>Бот:</b> ${botReply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
  messages = [];
  document.getElementById("messages").innerHTML = "";
}
