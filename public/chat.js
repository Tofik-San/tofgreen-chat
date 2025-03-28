
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chat = document.getElementById('chat');

let history = JSON.parse(localStorage.getItem('chatHistory')) || [];

function renderMessages() {
  chat.innerHTML = '';
  history.forEach(msg => {
    const container = document.createElement('div');
    container.className = 'message ' + msg.role;

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = msg.role === 'user' ? 'Я' : '';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';

    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = msg.content;

    container.appendChild(msg.role === 'user' ? label : avatar);
    container.appendChild(text);
    chat.appendChild(container);
  });
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  history.push({ role: 'user', content: text });
  if (history.length > 6) history = history.slice(-6);
  renderMessages();
  input.value = "";

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history })
  });

  const data = await res.json();
  history.push({ role: 'assistant', content: data.reply });
  if (history.length > 6) history = history.slice(-6);
  localStorage.setItem('chatHistory', JSON.stringify(history));
  renderMessages();
});

renderMessages();
