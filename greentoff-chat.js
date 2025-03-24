
async function sendMessage() {
    const input = document.getElementById('userInput');
    const messages = document.getElementById('messages');
    const userText = input.value.trim();
    if (!userText) return;

    messages.innerHTML += "\nВы: " + userText;

    const response = await fetch('/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    messages.innerHTML += "\nИИ: " + (data.reply || 'Ошибка ответа');
    input.value = '';
}
