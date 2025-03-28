async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += "<p><strong>Ты:</strong> " + message + "</p>";
  input.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    chatBox.innerHTML += "<p><strong>Бот:</strong> " + data.reply + "</p>";
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    chatBox.innerHTML += "<p><em>Ошибка: не удалось получить ответ</em></p>";
  }
}

function clearChat() {
  document.getElementById("chat-box").innerHTML = "";
}