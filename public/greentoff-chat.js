async function sendMessage() {
    const input = document.getElementById("userInput");
    const userText = input.value.trim();
    if (userText === "") return;

    appendMessage("РЇ", userText);
    input.value = "";

    try {
        const response = await fetch("/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });

        const data = await response.json();
        appendMessage("Р§Р°С‚", data.reply);
    } catch (error) {
        appendMessage("Р§Р°С‚", "РћС€РёР±РєР° СЃРѕРµРґРёРЅРµРЅРёСЏ. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.");
        console.error(error);
    }
}

// РЎРѕС…СЂР°РЅСЏРµРј РёСЃС‚РѕСЂРёСЋ РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё СЃС‚СЂР°РЅРёС†С‹
window.addEventListener("load", () => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
        document.getElementById("messages").innerHTML = savedMessages;
    }
});

// РЎРѕС…СЂР°РЅСЏРµРј РёСЃС‚РѕСЂРёСЋ С‡Р°С‚Р° РїРѕСЃР»Рµ РєР°Р¶РґРѕРіРѕ СЃРѕРѕР±С‰РµРЅРёСЏ
function saveChatHistory() {
    const chatContent = document.getElementById("messages").innerHTML;
    localStorage.setItem("chatHistory", chatContent);
}

// Р”РѕР±Р°РІР»РµРЅРёРµ СЃРѕРѕР±С‰РµРЅРёР№ РІ РѕРєРЅРѕ С‡Р°С‚Р°
function appendMessage(sender, message) {
    const chatWindow = document.getElementById("messages");
    if (!chatWindow) {
        console.error("Р­Р»РµРјРµРЅС‚ 'messages' РЅРµ РЅР°Р№РґРµРЅ.");
        return;
    }
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    saveChatHistory();
}

// РќР°Р·РЅР°С‡Р°РµРј РґРµР№СЃС‚РІРёСЏ РїРѕ РєРЅРѕРїРєРµ Рё Enter
document.getElementById("sendMessage").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
