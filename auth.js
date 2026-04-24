function defaultUserData() {
  return {
    resume: {},
    analysis: {},
    solved: {
      dsa: [],
      hr: [],
      aptitude: []
    }
  };
}

function getUserData() {
  const raw = localStorage.getItem("userData");

  if (!raw) {
    return defaultUserData();
  }

  try {
    const parsed = JSON.parse(raw);
    const base = defaultUserData();

    return {
      resume: parsed.resume || base.resume,
      analysis: parsed.analysis || base.analysis,
      solved: {
        dsa: Array.isArray(parsed?.solved?.dsa) ? parsed.solved.dsa : [],
        hr: Array.isArray(parsed?.solved?.hr) ? parsed.solved.hr : [],
        aptitude: Array.isArray(parsed?.solved?.aptitude) ? parsed.solved.aptitude : []
      }
    };
  } catch {
    return defaultUserData();
  }
}

function setUserData(data) {
  localStorage.setItem("userData", JSON.stringify(data));
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No account found. Please sign up first.");
    return;
  }

  if (user.email !== email || user.password !== password) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email: user.email }));

  const existingData = getUserData();
  setUserData(existingData);

  alert("Login successful!");
  window.location.href = "topics.html";
}

function signup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  // Password validation
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    alert(`Password must be at least ${minLength} characters long`);
    return;
  }

  if (!hasUpperCase) {
    alert("Password must contain at least one uppercase letter");
    return;
  }

  if (!hasLowerCase) {
    alert("Password must contain at least one lowercase letter");
    return;
  }

  if (!hasNumber) {
    alert("Password must contain at least one number");
    return;
  }

  if (!hasSpecialChar) {
    alert("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ name, email, password }));
  localStorage.setItem("userData", JSON.stringify(defaultUserData()));

  alert("Signup successful! Now login.");
  window.location.href = "signin.html";
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userData");
  window.location.href = "index.html";
}