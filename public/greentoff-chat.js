async function sendMessage() {
  const input = document.getElementById('userInput');
  const messages = document.getElementById('messages');
  const userText = input.value.trim();
  if (!userText) return;

  // Выводим сообщение пользователя
  messages.innerHTML += `\n\n<b>Вы:</b> ${userText}`;

  try {
    const response = await fetch('/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();

    // Выводим ответ ИИ
    messages.innerHTML += `\n<b>ИИ:</b> ${data.reply}`;
  } catch (error) {
    messages.innerHTML += `\n<b>ИИ:</b> Произошла ошибка при подключении к серверу.`;
  }

  input.value = '';
}

document.querySelector('button').addEventListener('click', sendMessage);
