import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

const slice = createSlice({
	name: 'posts',
	initialState: {
		list: [],
		loading: false,
		lastFetch: null,
		currentPage: 1,
		numberOfPages: null,
		postDetails: null,
	},
	reducers: {
		postUpdated: (posts, action) => {
			const index = posts.list.findIndex((post) => post._id === action.payload._id);
			posts.list[index] = action.payload;
		},
		postDeleted: (posts, action) => {
			posts.list = posts.list.filter((post) => post._id !== action.payload._id);
			posts.loading = false;
		},
		postLiked: (posts, action) => {
			const index = posts.list.findIndex((post) => post._id === action.payload._id);
			posts.list[index] = action.payload;
		},
		postsRequested: (posts, action) => {
			posts.loading = true;
		},
		postsRequestFailed: (posts, action) => {
			posts.loading = false;
		},
		postsReceived: (posts, action) => {
			const { posts: list, currentPage, numberOfPages } = action.payload;
			posts.list = list;
			posts.currentPage = currentPage;
			posts.numberOfPages = numberOfPages;
			posts.loading = false;
		},
		postsReceivedBySearch: (posts, action) => {
			posts.list = action.payload;
			posts.loading = false;
		},

		postReceived: (posts, action) => {
			posts.postDetails = action.payload;
			posts.loading = false;
		},
		postCommented: (posts, action) => {
			posts.comments = action.payload.comments;
		},
	},
});

export const {
	postUpdated,
	postDeleted,
	postLiked,
	postsRequested,
	postsReceived,
	postsReceivedBySearch,
	postsRequestFailed,
	postReceived,
	postCommented,
} = slice.actions;
export default slice.reducer;

const url = '/posts';

//action creator
export const loadPosts = (page) =>
	apiCallBegan({
		url: `${url}?page=${page}`,
		onStart: postsRequested.type,
		onSuccess: postsReceived.type,
		onError: postsRequestFailed.type,
	});

export const createPost = (data) =>
	apiCallBegan({
		url,
		method: 'post',
		data,
		onStart: postsRequested.type,
		onError: postsRequestFailed.type,
	});

export const updatePost = (id, updatedPost) =>
	apiCallBegan({
		url: url + '/' + id,
		method: 'patch',
		data: updatedPost,
		onSuccess: postUpdated.type,
	});

export const deletePost = (id) =>
	apiCallBegan({
		url: url + '/' + id,
		method: 'delete',
		// onStart: postsRequested.type,
		onSuccess: postDeleted.type,
	});

export const commentPost = (comment, id) =>
	apiCallBegan({
		url: url + '/' + id + '/comment',
		method: 'post',
		data: { comment },
		onSuccess: postCommented.type,
	});

export const likePost = (id) =>
	apiCallBegan({
		url: url + '/' + id + '/like',
		method: 'patch',
		onSuccess: postLiked.type,
	});

export const getPostsBySearch = (searchQuery) =>
	apiCallBegan({
		url: `${url}/search?searchQuery=${searchQuery.search || 'none'}&tags=${
			searchQuery.tags
		}`,
		onStart: postsRequested.type,
		onSuccess: postsReceivedBySearch.type,
		onError: postsRequestFailed.type,
	});

export const getPost = (id) =>
	apiCallBegan({
		url: url + '/' + id,
		onStart: postsRequested.type,
		onSuccess: postReceived.type,
		onError: postsRequestFailed.type,
	});
