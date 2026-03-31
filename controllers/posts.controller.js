// controllers/posts.controller.js
const path = require('path');
const fs = require('fs');
const db = require('../store/db');

const getPosts = (req, res) => {
  let page = Math.max(parseInt(req.query.page) || 1, 1);
  let limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const sorted = [...db.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = sorted.length;
  const data = sorted.slice(skip, skip + limit);

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  });
};

const getPostById = (req, res) => {
  const id = parseInt(req.params.id);
  const post = db.findPostById(id);
  if (!post) return res.status(404).json({ success: false, error: `Post ${id} not found.` });
  return res.status(200).json({ success: true, data: post });
};

const createPost = (req, res) => {
  const { title, content } = req.body;

  if (!title?.trim() || !content?.trim()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'title and content are required.' });
  }

  const post = {
    id: db.nextPostId(),
    title: title.trim(),
    content: content.trim(),
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    author: { id: req.user.id, username: req.user.username },
    likes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.posts.push(post);
  return res.status(201).json({ success: true, data: post });
};

const updatePost = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = db.findPostIndexById(id);

  if (idx === -1) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(404).json({ success: false, error: `Post ${id} not found.` });
  }

  const post = db.posts[idx];

  if (post.author.id !== req.user.id) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(403).json({ success: false, error: 'You can only edit your own posts.' });
  }

  const { title, content } = req.body;
  if (title !== undefined) post.title = title.trim() || post.title;
  if (content !== undefined) post.content = content.trim() || post.content;

  if (req.file) {
    // Delete old image from disk before swapping reference
    if (post.imageUrl) {
      const old = path.join(__dirname, '..', post.imageUrl);
      fs.unlink(old, () => {});
    }
    post.imageUrl = `/uploads/${req.file.filename}`;
  }

  post.updatedAt = new Date().toISOString();
  db.posts[idx] = post;

  return res.status(200).json({ success: true, data: post });
};

const deletePost = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = db.findPostIndexById(id);

  if (idx === -1) return res.status(404).json({ success: false, error: `Post ${id} not found.` });

  const post = db.posts[idx];
  if (post.author.id !== req.user.id) {
    return res.status(403).json({ success: false, error: 'You can only delete your own posts.' });
  }

  if (post.imageUrl) {
    const imgPath = path.join(__dirname, '..', post.imageUrl);
    fs.unlink(imgPath, () => {});
  }

  db.posts.splice(idx, 1);
  return res.status(200).json({ success: true, data: { message: `Post ${id} deleted.` } });
};

const toggleLike = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = db.findPostIndexById(id);
  if (idx === -1) return res.status(404).json({ success: false, error: `Post ${id} not found.` });

  const post = db.posts[idx];
  const userId = req.user.id;
  const likedAt = post.likes.indexOf(userId);

  const action = likedAt === -1 ? 'liked' : 'unliked';
  likedAt === -1 ? post.likes.push(userId) : post.likes.splice(likedAt, 1);

  return res.status(200).json({ success: true, data: { action, likes: post.likes.length } });
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost, toggleLike };
