function login() {
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;

  let user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No account found. Please sign up first.");
    return;
  }

  if (user.email === email && user.password === password) {
    alert("Login successful!");
    window.location.href = "topics.html";
  } else {
    alert("Invalid credentials");
  }
}
function signup() {
  let name = document.getElementById("signup-name").value;
  let email = document.getElementById("signup-email").value;
  let password = document.getElementById("signup-password").value;

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ name, email, password }));

  alert("Signup successful! Now login.");
  window.location.href = "signin.html";
}