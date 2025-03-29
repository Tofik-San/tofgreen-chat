
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const modelInfo = document.getElementById("modelInfo");

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage("Я", message);
  userInput.value = "";

  try {
    const res = await fetch("/chat", {
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

    const data = await res.json();
    appendMessage("Бот", data.reply || "Нет ответа.");
    modelInfo.textContent = "Активная модель: " + (data.modelUsed || "Не указана");
  } catch (err) {
    appendMessage("Бот", "Ошибка при подключении к серверу.");
    console.error("Ошибка:", err);
  }
}
