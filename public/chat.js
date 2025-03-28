
const messages = [];

async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();
    if (!message) return;

    messages.push({ role: "user", content: message });
    displayMessages();

    userInput.value = "";

    try {
        const response = await fetch("/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages }),
        });

        const data = await response.json();
        const botReply = data.reply || "Ошибка: бот не ответил";

        messages.push({ role: "assistant", content: botReply });
        displayMessages();
    } catch (error) {
        messages.push({ role: "assistant", content: "Ошибка соединения с сервером." });
        displayMessages();
    }
}

function displayMessages() {
    const chatBox = document.getElementById("messages");
    chatBox.innerHTML = messages.map(msg => {
        return `<b>${msg.role === "user" ? "Ты" : "Бот"}:</b> ${msg.content}`;
    }).join("<br><br>");
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
    messages.length = 0;
    document.getElementById("messages").innerHTML = "";
}
