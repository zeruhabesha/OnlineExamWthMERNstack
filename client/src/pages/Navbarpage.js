import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiMenu, FiHome, FiBookOpen, FiCalendar, FiBell, FiChevronDown } from 'react-icons/fi';

const NavbarPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = () => {
    const scheduleSection = document.getElementById('schedule-section');
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="nava bg-gray-800 p-4 lg:p-6">
          <div className="mx-auto flex justify-between items-center">
      <Link to="/" className="text-white text-lg font-semibold no-underline">
        Online Exam System
      </Link>
      <div className="block lg:hidden">
        <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
          <FiMenu className="h-6 w-6" />
        </button>
      </div>
      <ul className={`lg:flex space-x-4 ${isOpen ? 'block' : 'hidden'} lg:block`}>
        <li>
          <Link to="/" className="text-gray-300 hover:text-white flex items-center py-2 px-3 rounded-md transition duration-300 ease-in-out no-underline">
            <FiHome className="h-5 w-5 mr-2" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/materialpage" className="text-gray-300 hover:text-white flex items-center py-2 px-3 rounded-md transition duration-300 ease-in-out no-underline">
            <FiBookOpen className="h-5 w-5 mr-2" />
            Materials
          </Link>
        </li>
        <li>
          <Link to="/schedulepage" className="text-gray-300 hover:text-white flex items-center py-2 px-3 rounded-md transition duration-300 ease-in-out no-underline">
            <FiCalendar className="h-5 w-5 mr-2" />
            Schedule
          </Link>
        </li>
        <li>
          <Link to="/announcementpage" className="text-gray-300 hover:text-white flex items-center py-2 px-3 rounded-md transition duration-300 ease-in-out no-underline">
            <FiBell className="h-5 w-5 mr-2" />
            Announcements
          </Link>
        </li>
        <li>
          <Link to="/login" className="text-gray-300 hover:text-white flex items-center py-2 px-3 rounded-md transition duration-300 ease-in-out no-underline">
            <FiLogIn className="h-5 w-5 mr-2" />
            Login
          </Link>
        </li>
      </ul>
    </div>
      {/* <div className="text-center mt-4">
        <button onClick={scrollToSection} className="text-gray-300 hover:text-white focus:outline-none">
          <FiChevronDown className="h-20 w-20 animate-bounce" />
        </button>
      </div> */}
    </nav>
  );
};

export default NavbarPage;
