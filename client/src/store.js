import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer'; // Assuming you have this reducer
import uiReducer from './reducers/uiReducer'; // Assuming you have this reducer
import adminReducer from './reducers/adminReducer'; // Assuming you have this reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    admin: adminReducer,
  },
});

export default store;

