
async function sendMessage() {
  const input = document.getElementById("user-input");
  const messages = document.getElementById("messages");
  const userText = input.value.trim();
  if (!userText) return;

  messages.innerHTML += "<p><strong>Ты:</strong> " + userText + "</p>";
  input.value = "";
  
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userText }),
  });

  const data = await response.json();
  messages.innerHTML += "<p><strong>Бот:</strong> " + data.reply + "</p>";
  messages.scrollTop = messages.scrollHeight;
}

function resetChat() {
  document.getElementById("messages").innerHTML = "";
}
