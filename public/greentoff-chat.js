window.addEventListener("load", () => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
        document.getElementById("messages").innerHTML = savedMessages;
    }
});

// РЎРѕС…СЂР°РЅСЏРµРј РёСЃС‚РѕСЂРёСЋ СЃРѕРѕР±С‰РµРЅРёР№ РїРѕСЃР»Рµ РєР°Р¶РґРѕРіРѕ РѕС‚РІРµС‚Р°
function saveChatHistory() {
    const chatContent = document.getElementById("messages").innerHTML;
    localStorage.setItem("chatHistory", chatContent);
}

// Р”РѕР±Р°РІР»СЏРµРј СЃРѕРѕР±С‰РµРЅРёРµ РІ С‡Р°С‚
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

    appendMessage("РЇ", userText);
    try {
        const response = await fetch('/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });
        const data = await response.json();
        appendMessage("Р§Р°С‚", data.reply);
    } catch (error) {
        appendMessage("Р§Р°С‚", "РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР°. РџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘ СЂР°Р·.");
    }
    input.value = '';
}

// РћР±СЂР°Р±РѕС‚С‡РёРєРё СЃРѕР±С‹С‚РёР№
document.getElementById("sendMessage").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    });
