// script.js
window.onload = () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Elements
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const signupBtn = document.getElementById('signup-btn');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const authMessage = document.getElementById('auth-message');

  const authContainer = document.getElementById('auth-container');
  const appContainer = document.getElementById('app-container');
  const userEmailSpan = document.getElementById('user-email');

  const postInput = document.getElementById('post-input');
  const addPostBtn = document.getElementById('add-post-btn');
  const postsList = document.getElementById('posts-list');

  // Sign up
  signupBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      authMessage.textContent = 'Please enter email and password.';
      return;
    }
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        authMessage.textContent = 'Sign Up Successful!';
        emailInput.value = '';
        passwordInput.value = '';
      })
      .catch(error => {
        authMessage.textContent = `Error: ${error.message}`;
      });
  });

  // Login
  loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
      authMessage.textContent = 'Please enter email and password.';
      return;
    }
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        authMessage.textContent = 'Logged In!';
        emailInput.value = '';
        passwordInput.value = '';
      })
      .catch(error => {
        authMessage.textContent = `Error: ${error.message}`;
      });
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    auth.signOut();
  });

  // Auth state change (user logged in or out)
  auth.onAuthStateChanged(user => {
    if (user) {
      // User logged in
      authContainer.style.display = 'none';
      appContainer.style.display = 'block';
      userEmailSpan.textContent = user.email;
      authMessage.textContent = '';
      loadPosts();
      logoutBtn.style.display = 'inline-block';
    } else {
      // User logged out
      authContainer.style.display = 'block';
      appContainer.style.display = 'none';
      userEmailSpan.textContent = '';
      logoutBtn.style.display = 'none';
      postsList.innerHTML = '';
    }
  });

  // Add post
  addPostBtn.addEventListener('click', () => {
    const text = postInput.value.trim();
    if (!text) {
      alert('Please write something to post!');
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in!');
      return;
    }

    db.collection('posts').add({
      text: text,
      userEmail: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0
    }).then(() => {
      postInput.value = '';
      loadPosts();
    }).catch(err => alert('Error adding post: ' + err.message));
  });

  // Load posts
  function loadPosts() {
    postsList.innerHTML = '';
    db.collection('posts').orderBy('timestamp', 'desc').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const post = doc.data();
          const postId = doc.id;

          const postDiv = document.createElement('div');
          postDiv.className = 'post';

          const postText = document.createElement('p');
          postText.className = 'post-text';
          postText.textContent = post.text;
          postDiv.appendChild(postText);

          const postUser = document.createElement('small');
          postUser.textContent = `By: ${post.userEmail}`;
          postDiv.appendChild(postUser);

          const likeBtn = document.createElement('button');
          likeBtn.textContent = `Like (${post.likes || 0})`;
          likeBtn.addEventListener('click', () => {
            // Update likes in Firestore
            const postRef = db.collection('posts').doc(postId);
            postRef.update({
              likes: firebase.firestore.FieldValue.increment(1)
            }).then(loadPosts);
          });
          postDiv.appendChild(likeBtn);

          postsList.appendChild(postDiv);
        });
      });
  }
};
