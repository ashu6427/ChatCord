const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomUsers = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get the username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log(username, room);

const socket = io();

//join chatroom
socket.emit("joinRoom", { username, room });

//getting user and room info
socket.on("roomUsers", ({ room, users }) => {
  outputRoomUsers(room);
  outputUser(users);
});

//message from server
socket.on("message", (message) => {
  outputMessage(message);

  //scrolling down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submission
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text
  const msg = e.target.elements.msg.value;

  //enter text to server
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output message
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}&nbsp;&nbsp;&nbsp;<span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

//add room name to DOM
function outputRoomUsers(room) {
  roomUsers.innerHTML = `${room}`;
}

//add users to DOM
function outputUser(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join(" ")}`;
}
