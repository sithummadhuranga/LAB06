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
    nav.appendChild(logoutBtn);
  } else {
    const loginLink = document.createElement('a');
    loginLink.href = '/login';
    loginLink.className = 'nav-link';
    loginLink.textContent = 'Login';
    nav.appendChild(loginLink);
  }

  // Handle Likes
  const likeBtn = document.getElementById('likeBtn');
  if (likeBtn) {
    likeBtn.addEventListener('click', async () => {
      if (!token) {
        alert("Please log in to like posts.");
        window.location.href = '/login';
        return;
      }

      const postId = likeBtn.getAttribute('data-id');
      const likeCountSpan = document.getElementById('likeCount');
      
      try {
        const res = await fetch(`/api/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        
        if (data.success) {
          likeCountSpan.textContent = data.data.likes;
          if (data.data.action === 'liked') {
            likeBtn.style.background = 'rgba(233, 78, 123, 0.2)';
          } else {
            likeBtn.style.background = 'transparent';
          }
        } else {
          alert('Error: ' + data.error);
        }
      } catch (err) {
        alert('Network error. Please try again.');
      }
    });
  }
});
