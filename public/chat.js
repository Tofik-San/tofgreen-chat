
async function sendMessage() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const userBlock = document.createElement("div");
  userBlock.className = "message user";
  userBlock.innerText = userMessage;
  chat.appendChild(userBlock);
  input.value = "";

  const botBlock = document.createElement("div");
  botBlock.className = "message bot";
  botBlock.innerText = "Бот печатает...";
  chat.appendChild(botBlock);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();
    botBlock.innerText = data.reply;
  } catch (err) {
    botBlock.innerText = "Ошибка: Не удалось получить ответ от сервера.";
  }

  chat.scrollTop = chat.scrollHeight;
}
