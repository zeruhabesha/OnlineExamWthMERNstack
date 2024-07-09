import React, { useState, useEffect } from 'react';
import Navadmin from './Navadmin';
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import icons for the toggle button

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

const Setting = () => {
  const [theme, setTheme] = useState(themes[0]);
  const [navToggle, setNavToggle] = useState(false);

  useEffect(() => {
    const storedThemeIndex = localStorage.getItem('themeIndex');
    if (storedThemeIndex && themes[storedThemeIndex]) {
      setTheme(themes[storedThemeIndex]);
    }
  }, []);

  const handleThemeChange = (index) => {
    if (themes[index]) {
      setTheme(themes[index]);
      localStorage.setItem('themeIndex', index);
    }
  };


  const toggleNav = () => {
    setNavToggle(!navToggle);
  };

  return (
    <div className="App">
      <Sidebar navToggle={navToggle} toggleNav={toggleNav} />
   
  <section className={`${theme.background} ${theme.textColor} dashboard min-h-screen p-4 flex-1`}>
    <input 
      id="nav-toggle" 
      type="checkbox" 
      checked={navToggle} 
      onChange={toggleNav} 
    />
      <Navadmin />
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Settings</h1>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Select a Theme</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {themes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThemeChange(index)}
                  className={`p-4 rounded-full border-2 ${theme.primaryColor === themes[index].primaryColor ? 'border-black' : 'border-transparent'} transition-all duration-300`}
                  style={{ backgroundColor: themes[index].primaryColor }}
                >
                  <div className="w-full h-full rounded-full"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <Footeradmin />
      </section>
    </div>
  );
};

export default Setting;
