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
      createForm.reset();
    });
  }

  // Handle Edit/Delete Inline Visibility & Actions
  const editModal = document.getElementById('editPostModal');
  const editForm = document.getElementById('editPostForm');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const editErrorBox = document.getElementById('editPostError');
  const editTitleInput = document.getElementById('editTitle');
  const editContentInput = document.getElementById('editContent');
  const editPostIdInput = document.getElementById('editPostId');

  document.querySelectorAll('.post-card').forEach(card => {
    const authorId = parseInt(card.getAttribute('data-author-id'));
    const postId = card.getAttribute('data-post-id');
    const actionContainer = card.querySelector('.post-owner-actions');

    if (user && user.id === authorId && actionContainer) {
      actionContainer.style.display = 'flex'; // Show inline buttons

      const deleteBtn = card.querySelector('.delete-inline-btn');
      const editBtn = card.querySelector('.edit-inline-btn');

      // Delete inline
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          if (!confirm('Are you sure you want to delete this post?')) return;
          deleteBtn.disabled = true;
          deleteBtn.textContent = '...';

          try {
            const res = await fetch(`/api/posts/${postId}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
              card.remove(); // Optimistic UI update
            } else {
              alert(data.error);
              deleteBtn.disabled = false;
              deleteBtn.textContent = 'Delete';
            }
          } catch (err) {
            alert('Network error while deleting.');
            deleteBtn.disabled = false;
            deleteBtn.textContent = 'Delete';
          }
        });
      }

      // Edit inline (Show Modal)
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          editPostIdInput.value = postId;
          editTitleInput.value = card.querySelector('.post-card__title').innerText.trim();
          editContentInput.value = card.querySelector('.post-card__excerpt').innerText.trim();
          editModal.style.display = 'flex';
        });
      }
    }

    // Card click navigation
    card.addEventListener('click', (e) => {
      // ignore if clicked edit/delete/like/link
      if (
        e.target.closest('button') || 
        e.target.closest('a') || 
        e.target.closest('.post-owner-actions') || 
        e.target.closest('.like-btn')
      ) {
        return;
      }
      window.location.href = `/post/${postId}`;
    });

    // Handle Like Button directly from Feed
    const likeBtn = card.querySelector('.like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); // prevent card click
        if (!token) {
          alert("Please log in to like posts.");
          window.location.href = '/login';
          return;
        }

        const btnPostId = likeBtn.getAttribute('data-id');
        const countSpan = likeBtn.querySelector('.like-count');
        
        try {
          const res = await fetch(`/api/posts/${btnPostId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            countSpan.textContent = data.data.likes;
            if (data.data.action === 'liked') {
              likeBtn.style.color = '#e94e7b';
            } else {
              likeBtn.style.color = 'inherit';
            }
          } else {
            alert('Error: ' + data.error);
          }
        } catch (err) {
          alert('Network error while liking.');
        }
      });
    }

  });

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      editModal.style.display = 'none';
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(editForm);
      const submitBtn = editForm.querySelector('button[type="submit"]');
      const postId = editPostIdInput.value;

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
          window.location.reload();
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
});
