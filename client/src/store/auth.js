import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

const slice = createSlice({
	name: 'auth',
	initialState: {},
	reducers: {
		googleLoggedIn: (state, action) => {
			return action.payload;
		},
		loggedOut: (state, action) => {
			return null;
		},
		signedUp: (state, action) => {
			return action.payload;
		},
		signedIn: (state, action) => {
			return action.payload;
		},
	},
});

export const { googleLoggedIn, loggedOut, signedUp, signedIn } = slice.actions;
export default slice.reducer;

//Action Creator
export const loginGoogle = (result, token) => ({
	type: googleLoggedIn.type,
	payload: { result, token },
});

export const logOut = () => ({
	type: loggedOut.type,
});

export const signUp = (data, history) => async (dispatch, getState) => {
	await dispatch(
		apiCallBegan({
			url: '/user/signup',
			method: 'post',
			data,
			onSuccess: signedUp.type,
		})
	);

	history.push('/');
};
export const signIn = (data, history) => async (dispatch, getState) => {
	await dispatch(
		apiCallBegan({
			url: '/user/signin',
			method: 'post',
			data,
			onSuccess: signedIn.type,
		})
	);

	history.push('/');
};
