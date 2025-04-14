
const token = localStorage.getItem("token");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Redirect if not logged in
if (!token) {
  alert("Login required");
  logout();
}

// Decode token to check expiry (optional enhancement)
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (e) {
    return true;
  }
}

if (isTokenExpired(token)) {
  alert("Session expired. Please login again.");
  logout();
}

async function loadMessages() {
  try {
    const { data } = await axios.get("http://localhost:3000/api/messages", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
    data.forEach(msg => {
      chatBox.innerHTML += `<p><strong>${msg.User.name}:</strong> ${msg.message}</p>`;
    });
  } catch (err) {
    alert("Session invalid. Please login again.");
    logout();
  }
}

async function sendMessage() {
  const message = document.getElementById("messageInput").value;
  if (!message) return;
  await axios.post("http://localhost:3000/api/messages", { message }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  document.getElementById("messageInput").value = "";
  loadMessages();
}

setInterval(loadMessages, 1000);
loadMessages();
