
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("input");
  const chatBox = document.getElementById("chat-box");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const userInput = input.value.trim();
    if (!userInput) return;

    appendMessage("user", userInput);
    input.value = "";

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      appendMessage("bot", data.reply);
    } catch (error) {
      appendMessage("bot", "Ошибка при получении ответа");
    }
  });

  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});
