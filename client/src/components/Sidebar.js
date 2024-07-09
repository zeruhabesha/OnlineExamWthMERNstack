import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Corrected import
import { faHome, faUserCircle , faCommentAlt, faFile, faBullhorn, faWrench, faCalendarAlt, faChartLine, faBookOpen, faUsers, faCog, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './NavBar1.css';

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

const Sidebar = ({ navToggle, toggleNav }) => {
  const [footerToggle, setFooterToggle] = useState(false);
  const [themeIndex, setThemeIndex] = useState(parseInt(localStorage.getItem("themeIndex")) || 0);

  useEffect(() => {
    const body = document.querySelector("body");
    themes.forEach((theme, index) => {
      if (index === themeIndex) {
        body.classList.add(theme.background);
        body.classList.add(theme.textColor);
      } else {
        body.classList.remove(theme.background);
        body.classList.remove(theme.textColor);
      }
    });
    return () => {
      themes.forEach((theme, index) => {
        body.classList.remove(theme.background);
        body.classList.remove(theme.textColor);
      });
    };
  }, [themeIndex]);

  const handleThemeChange = (index) => {
    localStorage.setItem("themeIndex", index);
    setThemeIndex(index);
  };

  const toggleFooter = () => {
    setFooterToggle(!footerToggle);
  };

  const userRole = localStorage.getItem('role');

  return (
    <div id="nav-bar" className={`bg-gray-900 text-white h-full flex flex-col transition-all duration-300 ${navToggle ? 'w-65' : 'w-24'}`}>
      <div id="nav-header" className="border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        {navToggle && (
          <a id="nav-title" href="#" target="_blank" rel="noopener noreferrer" className="text-lg font-bold">
            Online Exam
          </a>
        )}
        <button className="cursor-pointer" onClick={toggleNav}>
          <FontAwesomeIcon icon={navToggle ? faTimes : faBars} className="block w-6 h-6 text-white" />
        </button>
      </div>
      <div id="nav-content" className={`overflow-y-auto ${navToggle ? 'block' : 'hidden'} md:block flex-1 px-0 py-2`}>
        <ul className="space-y-2">
          <li className="menu-item">
            <Link 
              to="/dashboard" 
              className={`
                nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full link-name 
                ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
              `}
            >
              <FontAwesomeIcon icon={faHome} className="mr-2 text-white" />
              <span>Dashboard</span>
            </Link>
          </li>
          {userRole === 'admin' && (
            <>
              <li className="menu-item">
                <Link 
                  to="/admin" 
                  className={`
                    nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                    ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
                  `}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="mr-2 text-white" />
                  <span>Admin</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link 
                  to="/student" 
                  className={`
                    nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                    ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
                  `}
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-2 text-white" />
                  <span>Student</span>
                </Link>
              </li>
            </>
          )}
          <li className="menu-item">
            <Link 
              to="/exams" 
              className={`
                nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
              `}
            >
              <FontAwesomeIcon icon={faBookOpen} className="mr-2 text-white" />
              <span>Exams</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link 
              to="/examdetail" 
              className={`
                nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
              `}
            >
              <FontAwesomeIcon icon={faBookOpen} className="mr-2 text-white" />
              <span>Exams-Result</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link 
              to="/materials" 
              className={`
                nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
              `}
            >
              <FontAwesomeIcon icon={faFile} className="mr-2 text-white" />
              <span>Materials</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link 
              to="/announcements" 
              className={`
                nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
              `}
            >
              <FontAwesomeIcon icon={faBullhorn} className="mr-2 text-white" />
              <span>Announcements</span>
            </Link>
          </li>
          <li className="menu-item">
  <Link 
    to="/schedule" 
    className={`
      nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
      ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
    `}
  >
    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-white" /> {/* Use faCalendarAlt for calendar icon */}
    <span>Schedule</span>
  </Link>
</li>
          {userRole === 'admin' && (
            <li className="menu-item">
              <Link 
                to="/report" 
                className={`
                  nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                  ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
                `}
              >
                <FontAwesomeIcon icon={faChartLine} className="mr-2 text-white" />
                <span>Report</span>
              </Link>
            </li>
          )}
          <li className="menu-item">
            <Link 
              to="#" 
              className={`
                nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
              `}
            >
              <FontAwesomeIcon icon={faCommentAlt} className="mr-2 text-white" />
              <span>Discussion</span>
            </Link>
          </li>
          {userRole === 'admin' && (
            <li className="menu-item">
              <Link 
                to="#" 
                className={`
                  nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                  ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
                `}
              >
                <FontAwesomeIcon icon={faWrench} className="mr-2 text-white" />
                <span>Tools</span>
              </Link>
            </li>
          )}
          {/* {userRole === 'admin' && ( */}
            <li className="menu-item">
              <Link 
                to="/setting" 
                className={`
                  nav-button flex items-center p-2 ${themes[themeIndex].textColor} ${themes[themeIndex].hoverBg} rounded-l-full 
                  ${themes[themeIndex].hoverTextColor} hover:${themes[themeIndex].hoverTextColor} ${navToggle ? 'text-xl' : 'text-base'}
                `}
              >
                <FontAwesomeIcon icon={faCog} className="mr-2 text-white" />
                <span>Settings</span>
              </Link>
            </li>
          {/* )} */}
        </ul>
      </div>
      <div id="nav-footer" className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Footer</span>
          <button className="text-sm text-gray-400 focus:outline-none" onClick={toggleFooter}>
            {footerToggle ? 'Hide' : 'Show'}
          </button>
        </div>
        {footerToggle && (
          <div className="mt-2">
            <div className="flex flex-wrap">
              {themes.map((theme, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 ${theme.background} cursor-pointer m-1`}
                  onClick={() => handleThemeChange(index)}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NavBar1 = () => {
  const [navToggle, setNavToggle] = useState(false);

  const toggleNav = () => {
    setNavToggle(!navToggle);
  };

  return (
    <div className="flex">
      <Sidebar navToggle={navToggle} toggleNav={toggleNav} />
      <div className={`flex-grow ${navToggle ? 'ml-65' : 'ml-24'} transition-all duration-300`}>
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default NavBar1;
