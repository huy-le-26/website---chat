import { getValue, validateRequired } from "./index.js";
import { register } from "./firebase.js";

const registerForm = document.querySelector("#register-form");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = false;

    const fullname = getValue("#fullname");

    valid = validateRequired("Fullname", fullname);

    const email = getValue("#email");

    valid = validateRequired("Email", email);

    const password = getValue("#password");

    valid = validateRequired("Password", password);

    const password_confirmation = getValue("#password_confirmation");

    valid = validateRequired("Password confirm", password_confirmation);

    if (valid) {
      register(email, password)
        .then(() => {
          window.location.pathname = "/index.html";
        })
        .catch((error) => {});
    }
  });
}
