async function sendMessage() {
  const input = document.getElementById('userInput');
  const messages = document.getElementById('messages');
  const userText = input.value.trim();
  if (!userText) return;

  messages.innerHTML += `<div><b>Вы:</b> ${userText}</div>`;

  try {
    const response = await fetch('/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    messages.innerHTML += `<div><b>ИИ:</b> ${data.reply}</div>`;
  } catch (error) {
    messages.innerHTML += `<div><b>ИИ:</b> Произошла ошибка при подключении.</div>`;
  }

  input.value = '';
}

document.querySelector('button').addEventListener('click', sendMessage);
