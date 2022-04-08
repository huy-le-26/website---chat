function getValue(selector) {
  const element = document.querySelector(selector);
  if (element) {
    return element.value;
  }
}

function validateRequired(name, value) {
  if (!value) {
    alert(`${name} is required`);
    return false;
  }
  return true;
}

function checkLogin() {
  if (
    window.location.pathname.indexOf("login.html") !== -1 ||
    window.location.pathname.indexOf("register.html") !== -1
  ) {
    return;
  }

  const accessToken = localStorage.getItem("userToken");
  if (!accessToken) {
    window.location.pathname = "/login.html";
  } else {
  }
}

checkLogin();

export { getValue, validateRequired };
