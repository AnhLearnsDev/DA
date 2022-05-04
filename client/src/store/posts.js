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
	},
	reducers: {
		postCreated: (posts, action) => {
			posts.list.push(action.payload);
		},
		postUpdated: (posts, action) => {
			const index = posts.list.findIndex((post) => post._id === action.payload._id);
			posts.list[index] = action.payload;
		},
		postDeleted: (posts, action) => {
			return posts.list.filter((post) => post._id !== action.payload._id);
		},
		postLiked: (posts, action) => {
			const index = posts.list.findIndex((post) => post._id === action.payload._id);
			posts.list[index] = action.payload;
		},
		postsRequested: (posts, action) => {
			posts.loading = true;
		},
		postRequestFailed: (posts, action) => {
			posts.loading = false;
		},
		postsReceived: (posts, action) => {
			return { ...posts, ...action.payload, loading: false };
		},
		postsReceivedBySearch: (posts, action) => {
			return { ...posts, ...action.payload, loading: false };
		},
		postReceived: (posts, action) => {
			posts.post = action.payload;
			posts.loading = false;
		},
	},
});

export const {
	postCreated,
	postUpdated,
	postDeleted,
	postLiked,
	postsRequested,
	postsReceived,
	postsReceivedBySearch,
	postRequestFailed,
	postReceived,
} = slice.actions;
export default slice.reducer;

const url = '/posts';

//action creator
export const loadPosts = (page) => (dispatch, getState) => {
	dispatch(
		apiCallBegan({
			url: `${url}?page=${page}`,
			onStart: postsRequested.type,
			onSuccess: postsReceived.type,
			onError: postRequestFailed.type,
		})
	);
};

export const createPost = (newPost) =>
	apiCallBegan({
		url,
		method: 'post',
		data: newPost,
		onSuccess: postCreated.type,
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
		onSuccess: postDeleted.type,
	});

export const likePost = (id) =>
	apiCallBegan({
		url: url + '/' + id + '/like',
		method: 'patch',
		onSuccess: postLiked.type,
	});

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
	dispatch(
		apiCallBegan({
			url: `${url}/search?searchQuery=${searchQuery.search || 'none'}&tags=${
				searchQuery.tags
			}`,
			onStart: postsRequested.type,
			onSuccess: postsReceivedBySearch.type,
			onError: postRequestFailed.type,
		})
	);
};

export const getPost = (id) =>
	apiCallBegan({
		url: url + '/' + id,
		onStart: postsRequested.type,
		onSuccess: postReceived.type,
		onError: postRequestFailed.type,
	});
