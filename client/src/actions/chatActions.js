import { fetchChatsSuccess, fetchChatsFailure } from './actions'; // Import your action creators

export const fetchChats = () => {
  return async (dispatch) => {
    try {
      // Perform async operation here (e.g., fetch data from an API)
      const response = await fetch('your-api-endpoint');
      const data = await response.json();
      
      // Dispatch success action with the fetched data
      dispatch(fetchChatsSuccess(data));
    } catch (error) {
      // Dispatch failure action if an error occurs
      dispatch(fetchChatsFailure(error));
    }
  };
};
