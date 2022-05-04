import { configureStore } from '@reduxjs/toolkit';

import api from './middleware/api';
import auth from './middleware/auth';
import reducer from './reducer';

export default function () {
	return configureStore({
		reducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([api, auth]),
	});
}
