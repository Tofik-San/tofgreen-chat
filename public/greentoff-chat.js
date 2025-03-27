let chatHistory = [];

async function sendMessage() {
    const input = document.getElementById('userInput');
    const userText = input.value.trim();
    if (!userText) return;

    appendMessage("Я", userText);
    chatHistory.push({ role: "user", content: userText });

    try {
        const response = await fetch("/proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: chatHistory,
            }),
        });

        const data = await response.json();
        appendMessage("Чат", data.reply);
        chatHistory.push({ role: "assistant", content: data.reply });

        saveChatHistory(); // сохраняем с памятью
    } catch (error) {
        appendMessage("Error", "Произошла ошибка.");
    }

    input.value = "";
}

function appendMessage(sender, message) {
    const chatWindow = document.getElementById("chat-window");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = "<strong>" + sender + ":</strong> " + message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function saveChatHistory() {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
        try {
            chatHistory = JSON.parse(saved);
            chatHistory.forEach((entry) => {
                const who = entry.role === "user" ? "Я" : "Чат";
                appendMessage(who, entry.content);
            });
        } catch (e) {
            chatHistory = [];
        }
    }
}

window.addEventListener("load", () => {
    loadChatHistory();
});

document.getElementById("sendMessage").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
