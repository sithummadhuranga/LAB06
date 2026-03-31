document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errBox = document.getElementById('loginError');
      
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          window.location.href = '/feed';
        } else {
          errBox.textContent = data.error;
          errBox.style.display = 'block';
        }
      } catch (err) {
        errBox.textContent = 'Network error. Please try again.';
        errBox.style.display = 'block';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errBox = document.getElementById('registerError');
      
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          // auto login after register
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const loginData = await loginRes.json();
          if (loginData.success) {
            localStorage.setItem('token', loginData.data.token);
            localStorage.setItem('user', JSON.stringify(loginData.data.user));
            window.location.href = '/feed';
          }
        } else {
          errBox.textContent = data.error;
          errBox.style.display = 'block';
        }
      } catch (err) {
        errBox.textContent = 'Network error. Please try again.';
        errBox.style.display = 'block';
      }
    });
  }
});
