
const input = document.getElementById("input");
const chat = document.getElementById("chat");

let history = [];

function renderMessage(sender, content) {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.innerHTML = (content || "").replace(/\n/g, "<br>");
  chat.appendChild(message);
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
      body: JSON.stringify({ messages: history.slice(-6) })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let accumulated = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      accumulated += buffer.replace(/\n+/g, "<br>");
      botElement.innerHTML = accumulated;
      buffer = "";

      await new Promise(resolve => setTimeout(resolve, 20)); // Ускоренный рендеринг
    }

    history.push({ role: "assistant", content: accumulated.replace(/<br>/g, "\n") });
    if (history.length > 6) history.shift();

  } catch (error) {
    botElement.innerHTML = "Ошибка ответа от сервера.";
  }
}
