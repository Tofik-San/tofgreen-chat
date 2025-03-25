<!DOCTYPE html> <html lang="ru"> <head> <meta charset="UTF-8" /> <meta name="viewport"
content="width=device-width, initial-scale=1.0"/> <title>Greentoff Чат (рабочая версия)</title>
<style> body { font-family: Arial, sans-serif; background: #f2f4f8; margin: 0;
padding: 0; display: flex; flex-direction: column; height: 100vh; }
#messages { flex: 1; padding: 15px; overflow-y: auto; background: #ffffff;
box-shadow: inset 0 0 8px rgba(0,0,0,0.05); border-top: 1px solid #ccc; display: flex;
flex-direction: column; } #messages p { margin: 10px 0; padding: 10px;
border-radius: 6px; max-width: 90%; line-height: 1.4; } #messages p.user {
background: #e3f2fd; align-self: flex-end; } #messages p.bot { background:
#e8f5e9; align-self: flex-start; } #inputArea { display: flex; flexdirection: row; border-top: 1px solid #ccc; } #userInput { flex: 1;
padding: 10px; font-size: 16px; border: none; outline: none; }
#sendMessage { padding: 10px 20px; font-size: 16px; background: #4CAF50;
color: white; border: none; cursor: pointer; transition: background 0.3s; }
#sendMessage:hover { background: #45a049; } </style> </head> <body> <div
id="messages"></div> <div id="inputArea"> <input id="userInput" placeholder="Введите
сообщение..." autofocus /> <button id="sendMessage">Отправить</button> </div> <script>
async function sendMessage() { const input = document.getElementById('userInput'); const
messages = document.getElementById('messages'); const userText = input.value.trim(); if
(!userText) return; messages.innerHTML += `<p class="user"><b>Вы:</b> ${userText}</p>`;
messages.scrollTop = messages.scrollHeight; try { const response = await
fetch('/proxy', { method: 'POST', headers: { 'Content-Type': 'application/json'
}, body: JSON.stringify({ message: userText }) }); const data = await
response.json(); const reply = data.reply || "Нет ответа от бота.";
messages.innerHTML += `<p class="bot"><b>Бот:</b><br>${reply}</p>`; messages.scrollTop =
messages.scrollHeight; } catch (error) { messages.innerHTML += `<p
class="bot"><b>Ошибка:</b> не удалось получить ответ от сервера.</p>`; } input.value =
''; } document.getElementById('sendMessage').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keydown', function (e) { if (e.key ===
'Enter') { sendMessage(); } }); </script> </body> </html>
