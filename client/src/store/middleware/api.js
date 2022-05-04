import axios from 'axios';

import * as actions from '../api';

axios.interceptors.request.use((req) => {
	if (localStorage.getItem('profile')) {
		req.headers.Authorization = `Bearer ${
			JSON.parse(localStorage.getItem('profile')).token
		}`;
	}

	return req;
});

const api =
	({ dispatch, getState }) =>
	(next) =>
	async (action) => {
		if (action.type !== actions.apiCallBegan.type) return next(action);

		next(action);
		const { url, method, data, onSuccess, onError } = action.payload;
		try {
			const response = await axios.request({
				baseURL: 'http://localhost:5000',
				url,
				method,
				data,
			});

			dispatch(actions.apiCallSuccess(response.data));
			if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
		} catch (error) {
			dispatch(actions.apiCallFailed(error.message));
			if (onError) dispatch({ type: onError, payload: error });
		}
	};

export default api;
