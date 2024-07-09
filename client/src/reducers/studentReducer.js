// src/reducers/studentReducer.js
import {
  LOGIN_SUCCESS,
  LOGOUT,
  TAKE_EXAM,
  GET_READING_MATERIALS,
  VIEW_RESULT,
  VIEW_ANNOUNCEMENT_SCHEDULE,
  FETCH_STUDENTS,
  ADD_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT
} from '../actions/actionTypes';

const initialState = {
  isAuthenticated: false,
  exams: [],
  readingMaterials: [],
  results: [],
  announcements: [],
  schedules: [],
  students: [],
};

const studentReducer = (state = initialState, action) => {
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
    case TAKE_EXAM:
      return {
        ...state,
        exams: [...state.exams, action.payload],
      };
    case GET_READING_MATERIALS:
      return {
        ...state,
        readingMaterials: action.payload,
      };
    case VIEW_RESULT:
      return {
        ...state,
        results: action.payload,
      };
    case VIEW_ANNOUNCEMENT_SCHEDULE:
      return {
        ...state,
        announcements: action.payload.announcements,
        schedules: action.payload.schedules,
      };
    case FETCH_STUDENTS:
      return {
        ...state,
        students: action.payload,
      };
    case ADD_STUDENT:
      return {
        ...state,
        students: [...state.students, action.payload],
      };
    case UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.payload.id ? action.payload : student
        ),
      };
    case DELETE_STUDENT:
      return {
        ...state,
        students: state.students.filter((student) => student.id !== action.payload),
      };
    default:
      return state;
  }
};

export default studentReducer;
