
async function sendMessage() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  const userBubble = document.createElement("div");
  userBubble.className = "message user";
  userBubble.innerText = userMessage;
  chat.appendChild(userBubble);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await res.json();

    const botBubble = document.createElement("div");
    botBubble.className = "message bot";
    botBubble.innerText = data.reply;
    chat.appendChild(botBubble);
    chat.scrollTop = chat.scrollHeight;
  } catch (err) {
    const errorBubble = document.createElement("div");
    errorBubble.className = "message bot";
    errorBubble.innerText = "Бот: Ошибка соединения или сервера.";
    chat.appendChild(errorBubble);
  }
}
