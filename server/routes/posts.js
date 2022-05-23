import express from 'express';

import {
	createPost,
	getPosts,
	getPostsBySearch,
	updatePost,
	deletePost,
	likePost,
	getPost,
	commentPost,
} from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/search', getPostsBySearch);

router.get('/:id', getPost);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentPost);

export default router;
