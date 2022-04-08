import { getValue, validateRequired } from "./index.js";
import { login } from "./firebase.js";

const loginForm = document.querySelector("#login-form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = false;

    const email = getValue("#email");

    valid = validateRequired("Email", email);

    const password = getValue("#password");

    valid = validateRequired("Password", password);


    if (valid) {
      login(email, password)
        .then(() => {
          window.location.pathname = "/index.html";
        })
        .catch((error) => {});
    }
  });
}
