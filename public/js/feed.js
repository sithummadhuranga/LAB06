document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // Render Auth Navigation
  const nav = document.querySelector('.header-nav');
  if (token && user) {
    const logoutBtn = document.createElement('a');
    logoutBtn.href = '#';
    logoutBtn.className = 'nav-link';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    });
    
    // Add create post toggle
    const createBtn = document.createElement('button');
    createBtn.className = 'btn btn--primary';
    createBtn.textContent = 'Create Post';
    createBtn.style.marginLeft = '1rem';
    createBtn.addEventListener('click', () => {
      document.getElementById('createPostModal').style.display = 'flex';
    });
    
    nav.appendChild(createBtn);
    nav.appendChild(logoutBtn);
  } else {
    const loginLink = document.createElement('a');
    loginLink.href = '/login';
    loginLink.className = 'nav-link';
    loginLink.textContent = 'Login';
    nav.appendChild(loginLink);
  }

  // Handle Post Creation
  const createForm = document.getElementById('createPostForm');
  if (createForm) {
    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!token) {
        alert("Please log in to create a post.");
        return;
      }

      const formData = new FormData(createForm);
      const submitBtn = createForm.querySelector('button[type="submit"]');
      const errorBox = document.getElementById('createPostError');
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting...';
      
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await res.json();
        
        if (data.success) {
          window.location.reload();
        } else {
          errorBox.textContent = data.error;
          errorBox.style.display = 'block';
        }
      } catch (err) {
        errorBox.textContent = 'Network error. Please try again.';
        errorBox.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post';
      }
    });
    
    // Cancel button
    document.getElementById('cancelPostBtn').addEventListener('click', () => {
      document.getElementById('createPostModal').style.display = 'none';
    });
  }
});
