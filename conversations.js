import { getValue, validateRequired } from "./index.js";
import { DataStorage } from "./firebase.js";

const storage = new DataStorage();

storage.getConversations(onConversationsData);

const conversationsData = {};
let currentConversation;

function sendMessage(sender, message) {
  if (!currentConversation) {
    return;
  }

  const now = new Date().toISOString();
  const messages = currentConversation.messages
    ? [...currentConversation.messages, { sender, message, time: now }]
    : [
        {
          sender,
          message,
          time: now,
        },
      ];

  storage.updateConversation(currentConversation.id, {
    ...currentConversation,
    messages,
  });
}

const messageForm = document.querySelector("#message-form");
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!currentConversation) {
    return;
  }

  let valid = false;

  const message = getValue("#message-input");

  valid = validateRequired("message", message);

  const email = localStorage.getItem("email");

  if (valid) {
    sendMessage(email, message);
    const input = document.querySelector("#message-input");
    input.value = "";
  }
});

function selectConversation(id) {
  currentConversation = {
    ...conversationsData[id],
    id,
  };
  renderChats();
  if (currentConversation) {
    // render conversation details
    const mainHeader = document.querySelector("#main-conversation header");
    mainHeader.innerHTML = "";
    const headerDiv = document.createElement("div");
    const headerImg = document.createElement("img");
    headerImg.src =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_06.jpg";

    const headerH2 = document.createElement("h2");
    headerH2.innerHTML = currentConversation.name;
    const headerH3 = document.createElement("h3");
    headerH3.innerHTML = `${
      currentConversation.messages ? currentConversation.messages.length : 0
    } messages`;

    headerDiv.appendChild(headerH2);
    headerDiv.appendChild(headerH3);

    mainHeader.appendChild(headerImg);
    mainHeader.appendChild(headerDiv);
  }
}

function renderChats() {
  const container = document.querySelector("#chat");
  container.innerHTML = "";

  if (!currentConversation || !currentConversation.messages) {
    return;
  }

  const email = localStorage.getItem("email");
  for (let i = 0; i < currentConversation.messages.length; i++) {
    const message = currentConversation.messages[i];
    const li = document.createElement("li");

    const isMe = message.sender === email;
    li.setAttribute("class", isMe ? "me" : "you");
    const div = document.createElement("div");
    div.setAttribute("class", "entete");

    div.innerHTML = '<span class="status green"></span>';
    const h2 = document.createElement("h2");
    const h3 = document.createElement("h3");

    h2.innerHTML = message.sender;
    h3.innerHTML = Date.parse(message.time).toString();
    div.appendChild(h2);
    div.appendChild(h3);

    const triangle = document.createElement("div");
    triangle.setAttribute("class", "triangle");
    const messageElem = document.createElement("div");
    messageElem.setAttribute("class", "message");
    messageElem.innerHTML = message.message;

    li.appendChild(div);
    li.appendChild(triangle);
    li.appendChild(messageElem);

    container.appendChild(li);
  }
}

function onConversationsData(data) {
  console.log(data);
  if (!data) {
    return;
  }

  const conversations = document.querySelector("#conversations");

  conversations.innerHTML = "";

  const keys = Object.keys(data);

  const email = localStorage.getItem("email");

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    const conversation = data[key];

    if (conversation.members.indexOf(email) === -1) {
      continue;
    }

    conversationsData[key] = conversation;

    if (!currentConversation) {
      selectConversation(key);
    }

    if (currentConversation && currentConversation.id === key) {
      currentConversation = {
        ...conversation,
        id: key,
      };
      renderChats();
    }

    const container = document.createElement("li");
    container.addEventListener("click", () => {
      selectConversation(key);
    });
    container.setAttribute("data-id", key);
    conversations.appendChild(container);
    const img = document.createElement("img");
    img.src =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_06.jpg";
    const header = document.createElement("div");
    const h2 = document.createElement("h2");
    const h3 = document.createElement("h3");

    h2.innerHTML = conversation.name;
    h3.innerHTML = '<span class="status green"></span> online';
    container.appendChild(img);
    header.appendChild(h2);
    header.appendChild(h3);
    container.appendChild(header);

    conversations.appendChild(container);
  }
}

function createConversation(name, members) {
  storage.createConversation(name, members);
}

const conversationsForm = document.querySelector("#conversations-form");

let loading = false;

if (conversationsForm) {
  conversationsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    loading = true;

    let valid = false;

    const name = getValue("#name");

    valid = validateRequired("name", name);

    const member = getValue("#member");

    valid = validateRequired("member", member);

    const email = localStorage.getItem("email");

    if (valid) {
      createConversation(name, [email, member]);
    }

    loading = false;
  });
}

const exitChat = document.querySelector(".LogOut")
exitChat.addEventListener("click" ,() =>{
localStorage.clear();
  window.location.pathname="./index.html"
})


