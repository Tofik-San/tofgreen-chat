const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messages = document.getElementById("messages");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;
  appendMessage("Ты", userText);
  input.value = "";
  try {
    const response = await fetch("/ask", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: userText }),
    });
    const data = await response.json();
    appendMessage("Бот", data.reply);
  } catch (err) {
    appendMessage("Бот", "Ошибка ответа от сервера.");
  }
});

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${role}:</strong> ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function resetChat() {
  messages.innerHTML = "";
}
