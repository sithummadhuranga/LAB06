// routes/posts.routes.js
const { Router } = require('express');
const {
  getPosts, getPostById,
  createPost, updatePost,
  deletePost, toggleLike,
} = require('../controllers/posts.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
