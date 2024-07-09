
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: true,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    set: (state, action) => {
      const newState = { ...state, ...action.payload };
      localStorage.setItem('uiState', JSON.stringify(newState));
      return newState;
    },
    // Add more reducers if needed
  },
});

export const { set } = uiSlice.actions;
export default uiSlice.reducer;
