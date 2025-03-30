
const input = document.getElementById("input");
const chat = document.getElementById("chat");

let history = [];

function renderMessage(sender, text) {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.innerText = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  renderMessage("user", userMessage);
  input.value = "";

  history.push({ role: "user", content: userMessage });

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.slice(-4)  // последние 2 пары (4 элемента)
      }),
    });

    const data = await res.json();
    renderMessage("bot", data.reply);

    history.push({ role: "assistant", content: data.reply });

    // Обрезаем, если больше 4 записей (2 пары)
    if (history.length > 4) history = history.slice(-4);
  } catch (err) {
    renderMessage("bot", "Ошибка соединения или сервера.");
  }
}
