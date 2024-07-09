import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-md p-6 rounded-md shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Ensure you have a div with id 'modal-root' in your index.html
  );
};

export default Modal;
