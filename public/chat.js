
const input = document.getElementById("input");
const chat = document.getElementById("chat");

let history = [];

function renderMessage(sender, content) {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.innerText = content || "";
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
  return message;
}

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  renderMessage("user", userMessage);
  input.value = "";

  history.push({ role: "user", content: userMessage });

  const botElement = renderMessage("bot", "");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-6) }) // 3 пары
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const char of chunk) {
        accumulated += char;
        botElement.innerText = accumulated;
        chat.scrollTop = chat.scrollHeight;
        await new Promise(r => setTimeout(r, 33)); // ~30 символов/сек
      }
    }

    history.push({ role: "assistant", content: accumulated });
    if (history.length > 6) history = history.slice(-6);
  } catch (err) {
    botElement.innerText = "Ошибка соединения или сервера.";
  }
}
