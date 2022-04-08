// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV6k1QlnUgAsgj7eDNf_NiOrEIW-aofI0",
  authDomain: "test-chat-e5061.firebaseapp.com",
  projectId: "test-chat-e5061",
  storageBucket: "test-chat-e5061.appspot.com",
  messagingSenderId: "890804168773",
  appId: "1:890804168773:web:24282d0fcacd3c87bcdb2c",
  databaseURL:
    "https://test-chat-e5061-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    localStorage.setItem("userToken", user.accessToken);
    localStorage.setItem("email", email);
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Signed in
    const user = userCredential.user;

    localStorage.setItem("userToken", user.accessToken);
    localStorage.setItem("email", email);
  } catch (error) {
    alert(error.message);
    throw error;
  }
}

class DataStorage {
  db;
  constructor() {
    this.db = getDatabase();
  }

  getConversations(updateConversations) {
    const conversationsRef = ref(this.db, "chats");
    onValue(conversationsRef, (snapshot) => {
      const data = snapshot.val();
      updateConversations(data);
    });
  }

  getConversation(id, updateConversation) {
    const conversationRef = ref(this.db, "chats/" + id);
    onValue(conversationRef, (snapshot) => {
      const data = snapshot.val();
      updateConversation(data);
    });
  }

  createConversation(name, members) {
    const conversationsRef = ref(this.db, "chats");
    const newConversationRef = push(conversationsRef);
    set(newConversationRef, {
      name,
      members,
      messages: [],
    });
  }

  updateConversation(id, conversation) {
    const conversationRef = ref(this.db, "chats/" + id);
    set(conversationRef, conversation);
  }
}

export { DataStorage, register, login };
