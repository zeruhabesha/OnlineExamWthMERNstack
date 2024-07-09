import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import Modal from 'react-bootstrap/Modal';



const Footeradmin = (props) => {

  return (
    <div>
      <br/><br/><br/><br/>
      <section className="section7">
        <div className="ribbons-wrapper">
          <div className="ribbon">
            <span className="ribbon1"><span>Version 3.2.0</span></span>
            <footer className="main-footer">
              <div className="box22">
                <strong>Copyright © 2024-2025 <a href="#">BahirDar University Software Engineering Students</a>.</strong>
                All rights reserved.
              </div>
            </footer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footeradmin;
