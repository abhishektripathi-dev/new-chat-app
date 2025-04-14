const token = localStorage.getItem("token");

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("chatMessages");
    window.location.href = "index.html";
}

if (!token) logout();

const chatBox = document.getElementById("chatBox");
let allMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];

function renderMessages(messages) {
    chatBox.innerHTML = "";
    messages.forEach((msg) => {
        chatBox.innerHTML += `<p><strong>${msg.User.name}:</strong> ${msg.message}</p>`;
    });
}

function getLastMessageTimestamp() {
    if (allMessages.length === 0) return null;
    return allMessages[allMessages.length - 1].createdAt;
}

async function fetchNewMessages() {
    const after = getLastMessageTimestamp();
    try {
        const res = await axios.get(`http://localhost:3000/api/messages`, {
            headers: { Authorization: `Bearer ${token}` },
            params: after ? { after } : {},
        });

        const newMessages = res.data;
        if (newMessages.length > 0) {
            allMessages = [...allMessages, ...newMessages];
            localStorage.setItem("chatMessages", JSON.stringify(allMessages));
            renderMessages(allMessages);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    } catch (err) {
        alert("Error fetching messages");
        logout();
    }
}

async function sendMessage() {
    const message = document.getElementById("messageInput").value.trim();
    if (!message) return;

    try {
        await axios.post(
            "http://localhost:3000/api/messages",
            { message },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        document.getElementById("messageInput").value = "";
        fetchNewMessages(); // fetch immediately after send
    } catch (err) {
        alert("Failed to send");
    }
}

// Initial render
renderMessages(allMessages);
fetchNewMessages();
setInterval(fetchNewMessages, 1000);
