async function sendMessage() {
  const input = document.getElementById('userInput');
  const messages = document.getElementById('messages');
  const userText = input.value.trim();
  if (!userText) return;

  messages.innerHTML += '\n\nВы: ' + userText;

  const response = await fetch('/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText })
  });

  const data = await response.json();
  messages.innerHTML += "\n" + (data.reply || "Ошибка ответа от OpenAI");
  input.value = '';
}

document.querySelector('button').addEventListener('click', sendMessage);
