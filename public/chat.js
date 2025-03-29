
async function sendMessage() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  chat.innerHTML += `\n\nЯ: ${userMessage}\n`;
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage }]
      }),
    });
    const data = await res.json();
    chat.innerHTML += `Бот (${data.model}): ${data.reply}\n`;
    chat.scrollTop = chat.scrollHeight;
  } catch (err) {
    chat.innerHTML += "Бот: Ошибка соединения или сервера.\n";
  }
}
