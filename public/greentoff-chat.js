window.addEventListener("load", () => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
        document.getElementById("messages").innerHTML = savedMessages;
    }
});

function saveChatHistory() {
    const chatContent = document.getElementById("messages").innerHTML;
    localStorage.setItem("chatHistory", chatContent);
}

function appendMessage(sender, message) {
    const chatWindow = document.getElementById("messages");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    saveChatHistory();
}

// РћС‚РїСЂР°РІРєР° СЃРѕРѕР±С‰РµРЅРёСЏ
async function sendMessage() {
    const input = document.getElementById("userInput");
    const userText = input.value;
    if (!userText.trim()) return;

    appendMessage("Я", userText);
    try {
        const response = await fetch('/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });
        const data = await response.json();
        appendMessage("Я", data.reply);
    } catch (error) {
        appendMessage("Чат", "Привет давай разберемся что там у тебя");
    }
    input.value = '';
}

document.getElementById("sendMessage").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
    });
