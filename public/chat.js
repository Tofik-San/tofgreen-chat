document.getElementById("chat-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const inputField = document.getElementById("user-input");
    const userText = inputField.value.trim();
    if (!userText) return;

    appendMessage("user", userText);
    inputField.value = "";

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });
        const data = await response.json();
        appendMessage("bot", data.reply || "Ошибка ответа.");
    } catch (error) {
        appendMessage("bot", "Ошибка связи с сервером.");
    }
});

function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "user" ? "user-message" : "bot-message";
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}