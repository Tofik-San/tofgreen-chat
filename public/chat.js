
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

function appendMessage(sender, text) {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("Я", message);
  userInput.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: [
          { role: "system", content: "Ты — персональный помощник. Отвечай ясно, с уважением, по делу." },
          { role: "user", content: message }
        ]
      }),
    });

    const data = await response.json();
    appendMessage("Бот", data.reply);
  } catch (error) {
    appendMessage("Бот", "Ошибка соединения или сервера.");
  }
}
