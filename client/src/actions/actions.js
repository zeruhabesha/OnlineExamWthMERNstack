import axios from 'axios';
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
  FETCH_STUDENTS,
  ADD_STUDENT,
  UPDATE_STUDENT,
  DELETE_STUDENT,
  TAKE_EXAM,
  GET_READING_MATERIALS,
  VIEW_RESULT,
  VIEW_ANNOUNCEMENT_SCHEDULE,
  FETCH_VIEWERS,
  ADD_VIEWER,
  UPDATE_VIEWER,
  DELETE_VIEWER,
} from './actionTypes';

// Base URL for Axios
const BASE_URL = 'http://localhost:7000';

// Admin actions
export const fetchAdmins = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/admins`);
    dispatch({ type: FETCH_ADMINS, payload: response.data });
  } catch (error) {
    console.error('Error fetching admins:', error);
  }
};

export const addAdmin = (admin) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/register-admin`, admin);
    dispatch({ type: ADD_ADMIN, payload: response.data });
  } catch (error) {
    console.error('Error adding admin:', error);
  }
};

export const updateAdmin = (id, admin) => async (dispatch) => {
  try {
    const response = await axios.put(`${BASE_URL}/admin/update-admin/${id}`, admin);
    dispatch({ type: UPDATE_ADMIN, payload: response.data });
  } catch (error) {
    console.error('Error updating admin:', error);
  }
};

export const deleteAdmin = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/admin/delete-admin/${id}`);
    dispatch({ type: DELETE_ADMIN, payload: id });
  } catch (error) {
    console.error('Error deleting admin:', error);
  }
};

export const uploadReadingMaterials = (materials) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/upload-material`, materials);
    dispatch({ type: UPLOAD_READING_MATERIALS, payload: response.data });
  } catch (error) {
    console.error('Error uploading reading materials:', error);
  }
};

export const postResult = (result) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/post-result`, result);
    dispatch({ type: POST_RESULT, payload: response.data });
  } catch (error) {
    console.error('Error posting result:', error);
  }
};

export const uploadQuestions = (questions) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/upload-question-answer`, questions);
    dispatch({ type: UPLOAD_QUESTIONS, payload: response.data });
  } catch (error) {
    console.error('Error uploading questions:', error);
  }
};

// Student actions
export const fetchStudents = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/students`);
    dispatch({ type: FETCH_STUDENTS, payload: response.data });
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};

export const addStudent = (student) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/students`, student);
    dispatch({ type: ADD_STUDENT, payload: response.data });
  } catch (error) {
    console.error('Error adding student:', error);
  }
};

export const updateStudent = (id, student) => async (dispatch) => {
  try {
    const response = await axios.put(`${BASE_URL}/admin/update-student/${id}`, student);
    dispatch({ type: UPDATE_STUDENT, payload: response.data });
  } catch (error) {
    console.error('Error updating student:', error);
  }
};

export const deleteStudent = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/admin/delete-student/${id}`);
    dispatch({ type: DELETE_STUDENT, payload: id });
  } catch (error) {
    console.error('Error deleting student:', error);
  }
};

export const takeExam = (exam) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/student/take-exam`, exam);
    dispatch({ type: TAKE_EXAM, payload: response.data });
  } catch (error) {
    console.error('Error taking exam:', error);
  }
};

export const getReadingMaterials = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/student/reading-materials`);
    dispatch({ type: GET_READING_MATERIALS, payload: response.data });
  } catch (error) {
    console.error('Error getting reading materials:', error);
  }
};

export const viewResult = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/student/results`);
    dispatch({ type: VIEW_RESULT, payload: response.data });
  } catch (error) {
    console.error('Error viewing result:', error);
  }
};

export const viewAnnouncementSchedule = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/student/announcements-schedules`);
    const schedulesResponse = await axios.get(`${BASE_URL}/student/announcements-schedules`);
    dispatch({ type: VIEW_ANNOUNCEMENT_SCHEDULE, payload: { announcements: response.data, schedules: schedulesResponse.data } });
  } catch (error) {
    console.error('Error viewing announcement schedule:', error);
  }
};

// Viewer actions
export const fetchViewers = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/visitor/reading-materials`);
    dispatch({ type: FETCH_VIEWERS, payload: response.data });
  } catch (error) {
    console.error('Error fetching viewers:', error);
  }
};

export const addViewer = (viewer) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/visitor/announcements-schedules`, viewer);
    dispatch({ type: ADD_VIEWER, payload: response.data });
  } catch (error) {
    console.error('Error adding viewer:', error);
  }
};

export const updateViewer = (id, viewer) => async (dispatch) => {
  try {
    const response = await axios.put(`${BASE_URL}/admin/viewers/${id}`, viewer);
    dispatch({ type: UPDATE_VIEWER, payload: response.data });
  } catch (error) {
    console.error('Error updating viewer:', error);
  }
};

export const deleteViewer = (id) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/admin/viewers/${id}`);
    dispatch({ type: DELETE_VIEWER, payload: id });
  } catch (error) {
    console.error('Error deleting viewer:', error);
  }
};
