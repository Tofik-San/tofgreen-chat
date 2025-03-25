async function sendMessage() {
  const input = document.getElementById('userInput');
  const messages = document.getElementById('messages');
  const userText = input.value.trim();
  if (!userText) return;

  // Отображаем только один раз сообщение пользователя
  messages.innerHTML += `<p><b>Вы:</b> ${userText}</p>`;

  try {
    const response = await fetch('/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    messages.innerHTML += `<p><b>ИИ:</b> ${data.reply}</p>`;
  } catch (error) {
  
input.value = '';
document.getElementById('button').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
