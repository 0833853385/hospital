import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import commonReducer from './reducer/common.reducer';
import treatmentReducer from '../../treatment/common/treatment.slice';
import calendarReducer from '../../appointment/calendar/calendarSlice';
import authReducer from '../../auth/auth.slice'; // Updated import
import oauthReducer from '../../oauth/oauth.slice'; // New import

// ----------------------------------------------------------------------
const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['auth', 'oauth'], // Updated whitelist
};

const rootReducer = combineReducers({
  common: commonReducer,
  treatment: treatmentReducer,
  calendar: calendarReducer,
  auth: authReducer, // Updated reducer
  oauth: oauthReducer, // New reducer
});

export { rootPersistConfig, rootReducer };
