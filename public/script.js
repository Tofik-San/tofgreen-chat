
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const messages = document.getElementById('messages');
const resetButton = document.getElementById('reset-button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('Ты', userMessage);
  input.value = '';

  const response = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  });

  const data = await response.json();
  appendMessage('Бот', data.reply);
});

resetButton.addEventListener('click', () => {
  messages.innerHTML = '';
  input.value = '';
});

function appendMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}
