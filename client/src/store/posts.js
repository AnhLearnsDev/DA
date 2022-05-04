import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

const slice = createSlice({
	name: 'posts',
	initialState: {
		list: [],
		currentPage: 1,
		numberOfPage: null,
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
		postsReceived: (posts, action) => {
			return action.payload;
		},
		postsReceivedBySearch: (posts, action) => {
			return action.payload;
		},
	},
});

export const {
	postCreated,
	postUpdated,
	postDeleted,
	postLiked,
	postsReceived,
	postsReceivedBySearch,
} = slice.actions;
export default slice.reducer;

const url = '/posts';

//action creator
export const loadPosts = (page) => (dispatch, getState) => {
	dispatch(
		apiCallBegan({
			url: `${url}?page=${page}`,
			onSuccess: postsReceived.type,
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
			onSuccess: postsReceivedBySearch.type,
		})
	);
};
