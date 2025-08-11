window.onload = () => {
  const auth = firebase.auth();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const messageP = document.getElementById('message');

  signupBtn.onclick = () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      messageP.textContent = "Please enter email and password.";
      return;
    }
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCred => {
        messageP.textContent = `Sign Up Successful! Welcome, ${userCred.user.email}`;
      })
      .catch(e => {
        messageP.textContent = `Error: ${e.message}`;
      });
  };

  loginBtn.onclick = () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      messageP.textContent = "Please enter email and password.";
      return;
    }
    auth.signInWithEmailAndPassword(email, password)
      .then(userCred => {
        messageP.textContent = `Logged In! Welcome back, ${userCred.user.email}`;
      })
      .catch(e => {
        messageP.textContent = `Error: ${e.message}`;
      });
  };
};
