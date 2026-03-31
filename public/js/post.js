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

  // Handle Edit/Delete Visibility & Actions
  const article = document.querySelector('.post-detail-card');
  const postActions = document.getElementById('postActions');
  const editPostBtn = document.getElementById('editPostBtn');
  const deletePostBtn = document.getElementById('deletePostBtn');
  const editPostModal = document.getElementById('editPostModal');
  const editPostForm = document.getElementById('editPostForm');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editErrorBox = document.getElementById('editPostError');

  if (article && postActions && user) {
    const authorId = parseInt(article.getAttribute('data-author-id'));
    const postId = article.getAttribute('data-post-id');

    if (user.id === authorId) {
      postActions.style.display = 'flex'; // Show buttons if owner!

      // Delete Logic
      deletePostBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;

        deletePostBtn.disabled = true;
        deletePostBtn.textContent = 'Deleting...';

        try {
          const res = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            window.location.href = '/feed';
          } else {
            alert(data.error);
            deletePostBtn.disabled = false;
            deletePostBtn.textContent = 'Delete';
          }
        } catch (err) {
          alert('Network error while deleting.');
          deletePostBtn.disabled = false;
          deletePostBtn.textContent = 'Delete';
        }
      });

      // Edit Logic (Show Modal)
      editPostBtn.addEventListener('click', () => {
        editPostModal.style.display = 'flex';
      });

      // Hide Edit Modal
      cancelEditBtn.addEventListener('click', () => {
        editPostModal.style.display = 'none';
      });

      // Submit Edit
      editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editPostForm);
        const submitBtn = editPostForm.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
          const res = await fetch(`/api/posts/${postId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });
          const data = await res.json();

          if (data.success) {
            window.location.reload(); // Reload to show updated content
          } else {
            editErrorBox.textContent = data.error;
            editErrorBox.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
          }
        } catch (err) {
          editErrorBox.textContent = 'Network error while updating.';
          editErrorBox.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Save Changes';
        }
      });
    }
  }
});
