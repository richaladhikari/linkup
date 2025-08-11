// script.js

// Wait until the page fully loads to get elements
window.onload = () => {
  // Get input and button elements by ID
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const authMessage = document.getElementById('auth-message');

  // Sign Up event handler
  signupBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      authMessage.textContent = 'Please enter email and password.';
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        authMessage.textContent = `Sign Up Successful! Welcome, ${userCredential.user.email}`;
        emailInput.value = '';
        passwordInput.value = '';
      })
      .catch(error => {
        authMessage.textContent = `Error: ${error.message}`;
      });
  });

  // Log In event handler
  loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      authMessage.textContent = 'Please enter email and password.';
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        authMessage.textContent = `Logged In! Welcome back, ${userCredential.user.email}`;
        emailInput.value = '';
        passwordInput.value = '';
      })
      .catch(error => {
        authMessage.textContent = `Error: ${error.message}`;
      });
  });
};

