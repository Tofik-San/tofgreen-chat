
function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (message) {
    const chatBox = document.getElementById('chat-box');

    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = message;
    chatBox.appendChild(userMsg);

    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    botMsg.textContent = '...';
    chatBox.appendChild(botMsg);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
