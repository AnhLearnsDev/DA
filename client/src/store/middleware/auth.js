import * as actions from '../auth';

const auth = (store) => (next) => (action) => {
	if (
		[
			actions.googleLoggedIn.type,
			actions.signedIn.type,
			actions.signedUp.type,
		].includes(action.type)
	)
		localStorage.setItem('profile', JSON.stringify({ ...action.payload }));
	else if (action.type === actions.loggedOut.type) localStorage.clear();

	next(action);
};

export default auth;
