// src/reducers/index.js
import { combineReducers } from 'redux';
import adminReducer from './adminReducer';
import studentReducer from './studentReducer';
import viewerReducer from './viewerReducer';

const rootReducer = combineReducers({
  admin: adminReducer,
  student: studentReducer,
  viewer: viewerReducer,
});

export default rootReducer;
