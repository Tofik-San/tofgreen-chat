
function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (text === "") return;

  appendMessage(text, "user");
  input.value = "";
  autoGrow(input);

  setTimeout(() => {
    appendMessage("Ответ бота на: " + text, "bot");
  }, 600);
}

function appendMessage(message, sender) {
  const chatWindow = document.getElementById("chat-window");
  const msg = document.createElement("div");
  msg.className = "message " + sender;
  msg.textContent = message;
  chatWindow.appendChild(msg);
  scrollToBottom();
}

function scrollToBottom() {
  document.getElementById("end-of-chat").scrollIntoView({ behavior: "smooth" });
}

function autoGrow(element) {
  element.style.height = "auto";
  element.style.height = Math.min(element.scrollHeight, 100) + "px";
}
