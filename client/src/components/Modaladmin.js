// Modal.js

import React from 'react';
import ReactDOM from 'react-dom';

const Modaladmin = ({ onClose, children }) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modaladmin;
