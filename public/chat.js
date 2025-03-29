
let history = [];

document.getElementById("sendButton").addEventListener("click", async () => {
  const inputField = document.getElementById("userInput");
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  addMessage("Я", userMessage);
  history.push({ role: "user", content: userMessage });

  if (history.length > 5) {
    history = history.slice(-5); // сохраняем последние 5 сообщений
  }

  inputField.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, history: history }),
    });

    const data = await response.json();
    addMessage("Психолог", data.reply);
    history.push({ role: "assistant", content: data.reply });
  } catch (error) {
    console.error("Ошибка:", error);
    addMessage("Система", "Произошла ошибка при получении ответа.");
  }
});

function addMessage(sender, text) {
  const chatBox = document.getElementById("chatBox");
  const message = document.createElement("div");
  message.className = "message";
  message.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}
