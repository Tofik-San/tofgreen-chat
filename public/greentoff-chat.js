window.addEventListener("load", () => {
  const savedMessages = localStorage.getItem("chatHistory");
  if (savedMessages) {
    document.getElementById("chat-window").innerHTML = savedMessages;
  }
});

// РЎРѕС…СЂР°РЅСЏРµРј РёСЃС‚РѕСЂРёСЋ С‡Р°С‚Р° РїРѕСЃР»Рµ РєР°Р¶РґРѕРіРѕ СЃРѕРѕР±С‰РµРЅРёСЏ
function saveChatHistory() {
  const chatContent = document.getElementById("chat-window").innerHTML;
  localStorage.setItem("chatHistory", chatContent);
}

// Р”РѕР±Р°РІР»СЏРµРј СЃРѕРѕР±С‰РµРЅРёРµ Рё СЃРѕС…СЂР°РЅСЏРµРј РёСЃС‚РѕСЂРёСЋ
function appendMessage(sender, message) {
  const chatWindow = document.getElementById("chat-window");
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  saveChatHistory();
}

// РћС‚РїСЂР°РІРєР° СЃРѕРѕР±С‰РµРЅРёСЏ
async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (userText === "") return;

  appendMessage("РўС‹", userText);
  input.value = "";

  try {
    const response = await fetch("/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    appendMessage("Greentoff Agent", data.reply);
  } catch (error) {
    appendMessage("Greentoff Agent", "РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё РѕС‚РІРµС‚Р°.");
  }
}

document.getElementById("sendMessage").addEventListener("click", sendMessage);
