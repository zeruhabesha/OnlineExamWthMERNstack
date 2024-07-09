// src/reducers/adminReducer.js
import { 
  LOGIN_SUCCESS, 
  LOGOUT, 
  UPLOAD_READING_MATERIALS, 
  POST_RESULT, 
  UPLOAD_QUESTIONS,  
  FETCH_ADMINS,
  ADD_ADMIN,
  UPDATE_ADMIN,
  DELETE_ADMIN, 
} from '../actions/actionTypes';

const initialState = {
  isAuthenticated: false,
  readingMaterials: [],
  results: [],
  questions: [],
  admins: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    case UPLOAD_READING_MATERIALS:
      return {
        ...state,
        readingMaterials: [...state.readingMaterials, action.payload],
      };
    case POST_RESULT:
      return {
        ...state,
        results: [...state.results, action.payload],
      };
    case UPLOAD_QUESTIONS:
      return {
        ...state,
        questions: [...state.questions, action.payload],
      };
    case FETCH_ADMINS:
      return {
        ...state,
        admins: action.payload,
      };
    case ADD_ADMIN:
      return {
        ...state,
        admins: [...state.admins, action.payload],
      };
    case UPDATE_ADMIN:
      return {
        ...state,
        admins: state.admins.map((admin) =>
          admin.id === action.payload.id ? action.payload : admin
        ),
      };
    case DELETE_ADMIN:
      return {
        ...state,
        admins: state.admins.filter((admin) => admin.id !== action.payload),
      };
    default:
      return state;
  }
};

export default adminReducer;
