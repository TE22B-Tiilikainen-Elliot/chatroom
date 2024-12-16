const baseUrl = "https://151.177.19.118:25565"; //localhost:25565
let currentUsername = "";

function sendPostRequest(endpoint, data, callback) {
  fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(callback)
    .catch((error) => console.error("Error:", error));
}

function fetchMessages() {
  fetch(`${baseUrl}/receiveMessages`)
    .then((response) => response.json())
    .then((data) => {
      const chatArea = document.getElementById("chat-area");
      chatArea.innerHTML = ""; // Clear the chat area
      data.messages.forEach((msg) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>${msg.username}:</strong> ${msg.message}`;
        chatArea.appendChild(messageElement);
      });
      chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom
    })
    .catch((error) => console.error("Error fetching messages:", error));
}

document.getElementById("login-button").addEventListener("click", () => {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;
  const data = { username, password };

  sendPostRequest("/login", data, (response) => {
    alert(response.message);
    if (response.status === "success") {
      currentUsername = username;
      document.getElementById("login-container").style.display = "none";
      document.getElementById("chat-container").style.display = "block";
      fetchMessages();
      setInterval(fetchMessages, 2000); // Poll messages every 2 seconds
    }
  });
});

document.getElementById("signup-button").addEventListener("click", () => {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  const data = { username, password };

  sendPostRequest("/signup", data, (response) => {
    alert(response.message);
  });
});

document.getElementById("show-signup").addEventListener("click", () => {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", () => {
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
});

document.getElementById("send-message").addEventListener("click", () => {
  const message = document.getElementById("chat-message").value;
  if (!message.trim()) return;

  const data = { username: currentUsername, message };
  sendPostRequest("/sendMessage", data, (response) => {
    if (response.status === "success") {
      document.getElementById("chat-message").value = ""; // Clear input field
      fetchMessages();
    } else {
      alert(response.message);
    }
  });
});
