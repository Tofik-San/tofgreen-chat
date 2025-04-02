
const cleanHTML = (raw) => {
  if (window.marked && window.DOMPurify) {
    return DOMPurify.sanitize(marked.parse(raw || ""));
  }
  return raw || "";
};

const input = document.getElementById("input");
const chat = document.getElementById("chat");

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = input.value.trim();
  if (!content) return;

  const message = document.createElement("div");
  message.className = "message user";
  message.innerHTML = cleanHTML(content);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    });
    const data = await res.json();

    const reply = document.createElement("div");
    reply.className = "message bot";
    reply.innerHTML = cleanHTML(data.reply);
    chat.appendChild(reply);
    chat.scrollTop = chat.scrollHeight;
  } catch (err) {
    console.error(err);
  }
});

input.addEventListener("focus", () => {
  document.body.style.overscrollBehavior = "contain";
});
input.addEventListener("blur", () => {
  document.body.style.overscrollBehavior = "";
});
