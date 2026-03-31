const { Router } = require('express');
const db = require('../store/db');

const router = Router();

router.get('/feed', (req, res) => {
  let page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = 3;
  const sorted = [...db.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = sorted.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const posts = sorted.slice((page - 1) * limit, (page - 1) * limit + limit);

  res.render('feed', {
    title: 'Feed',
    posts,
    pagination: { page, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    totalPosts: total,
  });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.get('/post/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = db.findPostById(id);
  if (!post) return res.status(404).render('404', { title: 'Not Found' });
  
  res.render('post', { title: post.title, post });
});

module.exports = router;
