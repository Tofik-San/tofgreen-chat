const chatHistory = []; async function sendMessage() { const input =
document.getElementById('userInput'); const messages = document.getElementById('messages');
const userText = input.value.trim(); if (!userText) return; messages.innerHTML += `<p
class="user"><b>Вы:</b> ${userText}</p>`; messages.scrollTop = messages.scrollHeight;
chatHistory.push({ role: "user", content: userText }); const recentMessages =
chatHistory.slice(-6); // последние 3 пары сообщений try { const response = await
fetch('/proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ model: "gpt-3.5-turbo", messages: recentMessages })
}); const data = await response.json(); const reply = data.reply || "Нет ответа от бота.";
messages.innerHTML += `<p class="bot"><b>Бот:</b><br>${reply}</p>`; chatHistory.push({ role:
"assistant", content: reply }); messages.scrollTop = messages.scrollHeight; } catch (error) {
messages.innerHTML += `<p class="bot"><b>Ошибка:</b> не удалось получить ответ от сервера.</p>`; }
input.value = ''; } document.getElementById('sendMessage').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keydown', function (e) { if (e.key ===
'Enter') { sendMessage(); } });
