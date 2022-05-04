import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
	const { page } = req.query;

	try {
		const LIMIT = 4;
		const startIndex = (Number(page) - 1) * LIMIT; //get the starting index of every page
		const total = await PostMessage.countDocuments();

		const posts = await PostMessage.find()
			.sort({ _id: -1 })
			.limit(LIMIT)
			.skip(startIndex); //newest post first

		res.status(200).json({
			list: posts,
			currentPage: Number(page),
			numberOfPages: Math.ceil(total / LIMIT),
		});
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getPostsBySearch = async (req, res) => {
	const { searchQuery, tags } = req.query;
	try {
		const title = new RegExp(searchQuery, 'i');

		const posts = await PostMessage.find({
			$or: [{ title }, { tags: { $in: tags.split(',') } }],
		});

		res.status(200).json({ list: posts });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const createPost = async (req, res) => {
	const post = req.body;

	const newPost = new PostMessage({
		...post,
		creator: req.userId,
		// createdAt: new Date().toISOString(),
	});
	try {
		await newPost.save();

		res.status(200).json(newPost);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};

export const updatePost = async (req, res) => {
	const { id: _id } = req.params;
	const post = req.body;

	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send('No post with that id');

	const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
	res.json(updatedPost);
};

export const deletePost = async (req, res) => {
	const { id: _id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send('No post with that id');

	await PostMessage.findByIdAndRemove(_id);

	res.json({ _id });
};

export const likePost = async (req, res) => {
	const { id: _id } = req.params;

	if (!req.userId) return res.json({ message: 'Unauthenticated' });

	if (!mongoose.Types.ObjectId.isValid(_id))
		return res.status(404).send('No post with that id');

	const post = await PostMessage.findById(_id);

	const index = post.likes.findIndex((userId) => userId === String(req.userId));

	if (index === -1) {
		post.likes.push(String(req.userId));
	} else {
		post.likes = post.likes.filter((id) => id !== String(req.userId));
	}

	const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });

	res.json(updatedPost);
};

export const getPost = async (req, res) => {
	const { id } = req.params;

	try {
		const post = await PostMessage.findById(id);

		res.status(200).json(post);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};
