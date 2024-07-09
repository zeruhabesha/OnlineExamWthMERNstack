import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFail } from '../reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi'; // Import FiHome icon from react-icons/fi

const themes = [
  { background: 'bg-[#1A1A2E]', textColor: 'text-white', primaryColor: 'bg-[#0F3460]', hoverBg: 'hover:bg-[#0F3460]' },
  { background: 'bg-[#461220]', textColor: 'text-white', primaryColor: 'bg-[#E94560]', hoverBg: 'hover:bg-[#E94560]' },
  { background: 'bg-[#192A51]', textColor: 'text-white', primaryColor: 'bg-[#967AA1]', hoverBg: 'hover:bg-[#967AA1]' },
  { background: 'bg-[#F7B267]', textColor: 'text-black', primaryColor: 'bg-[#F4845F]', hoverBg: 'hover:bg-[#F4845F]' },
  { background: 'bg-[#F25F5C]', textColor: 'text-black', primaryColor: 'bg-[#642B36]', hoverBg: 'hover:bg-[#642B36]' },
  { background: 'bg-[#231F20]', textColor: 'text-white', primaryColor: 'bg-[#BB4430]', hoverBg: 'hover:bg-[#BB4430]' },
  { background: 'bg-[#FFFFFF]', textColor: 'text-black', primaryColor: 'bg-[#D3D3D3]', hoverBg: 'hover:bg-[#D3D3D3]' },
  { background: 'bg-[#ADD8E6]', textColor: 'text-black', primaryColor: 'bg-[#87CEEB]', hoverBg: 'hover:bg-[#87CEEB]' },
];

const roles = ['admin', 'student']; // Add more roles as needed

const Login = () => {
  const [theme, setTheme] = useState(themes[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin'); // Default role
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    const storedThemeIndex = localStorage.getItem('themeIndex');
    if (storedThemeIndex) {
      setTheme(themes[storedThemeIndex]);
    }
  }, []);

  const handleThemeChange = (index) => {
    setTheme(themes[index]);
    localStorage.setItem('themeIndex', index);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'role') setSelectedRole(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7000/api/auth/login', { email, password, role: selectedRole });
      const { token, id, RegNo, username, firstName, lastName, phoneNumber, stream, blind, schoolCode, region, zone,city,woreda, status,role, image, createdAt } = response.data;
      
      dispatch(loginSuccess(token));
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('RegNo', RegNo);
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);
      localStorage.setItem('phoneNumber', phoneNumber);
      localStorage.setItem('stream', stream);
      localStorage.setItem('blind', blind);
      localStorage.setItem('schoolCode', schoolCode);
      localStorage.setItem('region', region);
      localStorage.setItem('zone', zone);
      localStorage.setItem('city', city);
      localStorage.setItem('woreda', woreda);
      localStorage.setItem('status', status);
      localStorage.setItem('department', stream);
      localStorage.setItem('role', role);
      localStorage.setItem('image', image);
      localStorage.setItem('createdAt', createdAt);
      
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.data) {
        dispatch(loginFail(error.response.data.message)); // Assuming the server sends a message
      } else {
        dispatch(loginFail('Login failed: An unknown error occurred'));
      }
    }
  };

  return (
    <div className={`${theme.background} ${theme.textColor} min-h-screen flex items-center justify-center transition-colors duration-200`}>
      <div className="mt-4">
        <Link to="/" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
          <FiHome className="mr-2" /> {/* Icon with a margin for spacing */}
          Home
        </Link>
      </div>    
      <section className="container1">
        <div className="relative login-container1">
          <div className={`absolute w-32 h-32 ${theme.primaryColor} rounded-full top-0 left-0 transform -translate-x-1/2 -translate-y-1/2`}></div>
          <div className="form-container1 border border-gray-500 bg-opacity-10 backdrop-blur-sm shadow-xl rounded-xl p-8 z-10 relative">
            <img src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png" alt="illustration" className="absolute top-[-14%] right-0 w-[90%]" />
            <h1 className="opacity-60 text-4xl mb-8">LOGIN</h1>
            <form onSubmit={handleLogin} className="w-full max-w-sm">
              <input
                type="text"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Email"
                className="input-style1"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="PASSWORD"
                className="input-style1"
              />
              <div className="mt-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Select Role:</label>
                <select 
                  id="role"
                  name="role" 
                  value={selectedRole} 
                  onChange={handleOnChange} 
                  className={`
                    input-style1 
                    bg-white 
                    border border-gray-300 
                    rounded-md 
                    shadow-sm 
                    focus:outline-none 
                    focus:ring-blue-500 
                    focus:border-blue-500
                    block w-full p-2.5
                  `}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <br/>
              <button
                className={`${theme.primaryColor} text-white font-bold w-full py-3 rounded-md transition-transform transform hover:scale-105`}
                type="submit"
              >
                SUBMIT
              </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="flex justify-between mt-4 opacity-60">
              <a href="#">REGISTER</a>
              <a href="#">FORGOT PASSWORD</a>
            </div>
          </div>
          <br/> <br/> <br/> <br/>
          <div className="absolute bottom-8 left-0 flex space-x-2">
            {themes.map((th, index) => (
              <div
                key={index}
                className={`w-6 h-6 ${th.background} cursor-pointer`}
                onClick={() => handleThemeChange(index)}
              ></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
