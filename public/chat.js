async function sendMessage() {
  const input = document.getElementById("user-input");
  const chat = document.getElementById("chat");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("Я", message, "user");
  input.value = "";

  const history = getChatHistory();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });

    const data = await response.json();
    appendMessage("Бот", data.reply, "bot");
  } catch (error) {
    appendMessage("Бот", "Ошибка соединения", "bot");
  }
}

function appendMessage(sender, text, role) {
  const chat = document.getElementById("chat");
  const msg = document.createElement("div");
  msg.className = `message ${role}`;
  msg.textContent = `${sender}: ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function getChatHistory() {
  const messages = document.querySelectorAll(".message");
  const history = [];
  messages.forEach(msg => {
    const [roleText, ...rest] = msg.textContent.split(": ");
    if (roleText === "Я") {
      history.push({ role: "user", content: rest.join(": ") });
    } else if (roleText === "Бот") {
      history.push({ role: "assistant", content: rest.join(": ") });
    }
  });
  return history.slice(-3);
}