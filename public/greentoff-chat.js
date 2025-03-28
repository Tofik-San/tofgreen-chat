const form = document.querySelector("form");
const input = document.querySelector("input");
const chatLog = document.createElement("div");
chatLog.id = "chat-log";
document.body.appendChild(chatLog);

let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

function updateHistory(userMsg, botMsg) {
  history.push({ role: "user", content: userMsg });
  history.push({ role: "assistant", content: botMsg });
  if (history.length > 6) history = history.slice(-6); // последние 3 сообщения (user+assistant)
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage("Ты", message);
  input.value = "";

  const payload = {
    history: history,
    message: message,
  };

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  appendMessage("Бот", data.reply);
  updateHistory(message, data.reply);
});

function appendMessage(sender, text) {
  const msg = document.createElement("p");
  msg.textContent = `${sender}: ${text}`;
  chatLog.appendChild(msg);
}
