// src/reducers/viewerReducer.js
import { 
  FETCH_VIEWERS, 
  ADD_VIEWER, 
  UPDATE_VIEWER, 
  DELETE_VIEWER,
 
} from '../actions/actionTypes';

const initialState = {
  viewers: [],
};

const viewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VIEWERS:
      return {
        ...state,
        viewers: action.payload,
      };
    case ADD_VIEWER:
      return {
        ...state,
        viewers: [...state.viewers, action.payload],
      };
    case UPDATE_VIEWER:
      return {
        ...state,
        viewers: state.viewers.map((viewer) =>
          viewer.id === action.payload.id ? action.payload : viewer
        ),
      };
    case DELETE_VIEWER:
      return {
        ...state,
        viewers: state.viewers.filter((viewer) => viewer.id !== action.payload),
      };
    default:
      return state;
  }
};

export default viewerReducer;

