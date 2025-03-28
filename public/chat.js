
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chat = document.getElementById('chat');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return;

  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.textContent = text;
  chat.appendChild(userMsg);
  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  });

  const data = await response.json();
  const botMsg = document.createElement('div');
  botMsg.className = 'message bot';
  botMsg.textContent = data.reply;
  chat.appendChild(botMsg);
  chat.scrollTop = chat.scrollHeight;
});
