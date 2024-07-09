import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Imagess from './images/sample.jpg';

const themes = [
  { background: 'bg-[#1A1A2E]', textColor: 'text-white', primaryColor: '#0F3460', hoverBg: 'hover:bg-[#0F3460]', beforeBg: 'before:bg-[#0F3460]', afterBg: 'after:bg-[#0F3460]' },
  { background: 'bg-[#461220]', textColor: 'text-white', primaryColor: '#E94560', hoverBg: 'hover:bg-[#E94560]', beforeBg: 'before:bg-[#E94560]', afterBg: 'after:bg-[#E94560]' },
  { background: 'bg-[#192A51]', textColor: 'text-white', primaryColor: '#967AA1', hoverBg: 'hover:bg-[#967AA1]', beforeBg: 'before:bg-[#967AA1]', afterBg: 'after:bg-[#967AA1]' },
  { background: 'bg-[#F7B267]', textColor: 'text-black', primaryColor: '#F4845F', hoverBg: 'hover:bg-[#F4845F]', beforeBg: 'before:bg-[#F4845F]', afterBg: 'after:bg-[#F4845F]' },
  { background: 'bg-[#F25F5C]', textColor: 'text-black', primaryColor: '#642B36', hoverBg: 'hover:bg-[#642B36]', beforeBg: 'before:bg-[#642B36]', afterBg: 'after:bg-[#642B36]' },
  { background: 'bg-[#231F20]', textColor: 'text-white', primaryColor: '#BB4430', hoverBg: 'hover:bg-[#BB4430]', beforeBg: 'before:bg-[#BB4430]', afterBg: 'after:bg-[#BB4430]' },
  { background: 'bg-[#FFFFFF]', textColor: 'text-black', primaryColor: '#D3D3D3', hoverBg: 'hover:bg-[#D3D3D3]', beforeBg: 'before:bg-[#D3D3D3]', afterBg: 'after:bg-[#D3D3D3]' },
  { background: 'bg-[#ADD8E6]', textColor: 'text-black', primaryColor: '#87CEEB', hoverBg: 'hover:bg-[#87CEEB]', beforeBg: 'before:bg-[#87CEEB]', afterBg: 'after:bg-[#87CEEB]' },
];

const Navadmin = () => {
  const toggleSidebar = () => {
    const sidebar = document.querySelector('nav');
    sidebar.classList.toggle('close');
    localStorage.setItem('status', sidebar.classList.contains('close') ? 'close' : 'open');
  };

  const handleClick = () => {
    const elem = document.documentElement;
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(themes[0]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleClick1 = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleThemeChange = (index) => {
    if (themes[index]) {
      setTheme(themes[index]);
      localStorage.setItem('themeIndex', index);
    }
  };

  useEffect(() => {
    const storedThemeIndex = localStorage.getItem('themeIndex');
    if (storedThemeIndex && themes[storedThemeIndex]) {
      setTheme(themes[storedThemeIndex]);
    }
  }, []);

  const handleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('createdAt');
    localStorage.removeItem('token',);
    localStorage.removeItem('id');
    localStorage.removeItem('RegNo');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('stream');
    localStorage.removeItem('blind');
    localStorage.removeItem('schoolCode');
    localStorage.removeItem('region');
    localStorage.removeItem('zone');
    localStorage.removeItem('city');
    localStorage.removeItem('woreda');
    localStorage.removeItem('status');
    localStorage.removeItem('department');
    localStorage.removeItem('role');
    localStorage.removeItem('image');
    localStorage.removeItem('createdAt');
    // Redirect to the login page
    window.location.href = '/login';
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setShowLogoutModal(false); // Close the modal after logout
  };

  // Retrieve image URL from localStorage
  const userImage = localStorage.getItem('image') || ''; // Adjust the key according to your stored key

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <div className="flex flex-wrap space-x-2">
          {/* {themes.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThemeChange(index)}
              className={`p-2 m-1 ${theme.hoverBg} ${theme.textColor}`}
            >
              Theme {index + 1}
            </button>
          ))} */}
        </div>
        <div className="flex items-center space-x-4">
          <button className="uil uil-bars sidebar-toggle" onClick={toggleSidebar}></button>
          <button onClick={handleClick}>
            <i className="fas fa-expand-arrows-alt"></i>
          </button>
          <DropdownButton
            title={
              <img src={`http://localhost:7000/${userImage}`} alt="User Avatar" style={{height:`7vh`, width:`7vh`}} className="" />
            }
            id="profile-dropdown"
            menuRole="menu"
            className="nav-link"
            variant="light"
            onClick={handleProfileDropdown}
          >
            <Dropdown.Item as={Link} to="/adminprofile">
              Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogoutClick}>
              Logout
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>

      <Modal show={showLogoutModal} onHide={handleCloseLogoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Logout Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogoutModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Navadmin;
