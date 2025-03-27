async function sendMessage() {
 const input = document.getElementById('userInput');
 const messages = document.getElementById('messages');
 const userText = input.value.trim();
 if (!userText) return;
 messages.innerHTML += `<p><b>:</b> ${userText}</p>`;
 try {
 const response = await fetch('/proxy', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ message: userText })
 });
 const data = await response.json();
 messages.innerHTML += `<p><b>:</b> ${data.reply}</p>`;
 } catch (error) {
 messages.innerHTML += `<p><b>:</b> OpenAI</p>`;
 }
 input.value = '';
}
document.getElementById('sendMessage').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keydown', function (e) {
 if (e.key === 'Enter') {
 sendMessage();
 }
});
// Восстановление истории сообщений при загрузке страницы
window.addEventListener("load", () => {
  const savedMessages = localStorage.getItem("chatHistory");
  if (savedMessages) {
    document.getElementById("chat-window").innerHTML = savedMessages;
  }
});

// Сохраняем историю чата после каждого сообщения
function saveChatHistory() {
  const chatContent = document.getElementById("chat-window").innerHTML;
  localStorage.setItem("chatHistory", chatContent);
}

// Заменяем appendMessage на свою версию с сохранением
function appendMessage(sender, message) {
  const chatWindow = document.getElementById("chat-window");
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  saveChatHistory(); // сохраняем после добавления сообщения
}
