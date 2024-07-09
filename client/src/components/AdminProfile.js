import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropzone from 'react-dropzone';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import Navadmin from './Navadmin';

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

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    image: null,
    stream: '',
    schoolCode: '',
    region: '',
    zone: '',
    city: '',
    woreda: '',
    role: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not logged in');
        return;
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };
      const response = await axios.get('http://localhost:7000/admin/profile', { headers });

      setAdminData({
        username: localStorage.getItem('username') || response.data.username,
        firstName: localStorage.getItem('firstName') || response.data.firstName || '',
        lastName: localStorage.getItem('lastName') || response.data.lastName || '',
        email: localStorage.getItem('email') || response.data.email || '',
        phoneNumber: localStorage.getItem('phoneNumber') || response.data.phoneNumber || '',
        department: localStorage.getItem('department') || response.data.department || '',
        image: localStorage.getItem('image') || response.data.image || null,
        stream: localStorage.getItem('stream') || response.data.stream || '',
        schoolCode: localStorage.getItem('schoolCode') || response.data.schoolCode || '',
        region: localStorage.getItem('region') || response.data.region || '',
        zone: localStorage.getItem('zone') || response.data.zone || '',
        city: localStorage.getItem('city') || response.data.city || '',
        woreda: localStorage.getItem('woreda') || response.data.woreda || '',
        role: localStorage.getItem('role') || response.data.role || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setAdminData({ ...adminData, image: file });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append('username', adminData.username);
    formDataWithImage.append('firstName', adminData.firstName);
    formDataWithImage.append('lastName', adminData.lastName);
    formDataWithImage.append('email', adminData.email);
    formDataWithImage.append('phoneNumber', adminData.phoneNumber);
    formDataWithImage.append('department', adminData.department);
    formDataWithImage.append('role', adminData.role);
    if (adminData.image) {
      formDataWithImage.append('image', adminData.image);
    }
    if (adminData.role === 'student') {
      formDataWithImage.append('stream', adminData.stream);
      formDataWithImage.append('schoolCode', adminData.schoolCode);
      formDataWithImage.append('region', adminData.region);
      formDataWithImage.append('zone', adminData.zone);
      formDataWithImage.append('city', adminData.city);
      formDataWithImage.append('woreda', adminData.woreda);
    }

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };
      await axios.put('http://localhost:7000/admin/update-profile', formDataWithImage, { headers });
      toast.success('Profile updated successfully');
      fetchAdminProfile();
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update profile');
    }
  };

  const [navToggle, setNavToggle] = useState(false);

  const toggleNav = () => {
    setNavToggle(!navToggle);
  };

  return (
    <div>
      <Sidebar navToggle={navToggle} />
      <div className="flex flex-col w-full">
        <input
          id="nav-toggle"
          type="checkbox"
          checked={navToggle}
          onChange={toggleNav}
        />
        <Navadmin />

        <div className="flex flex-col w-full items-center">
          <h1 className="text-4xl font-bold my-4">Admin Profile</h1>
          <div className="w-full mx-auto flex flex-col items-center">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <form onSubmit={handleSaveProfile} className="w-full max-w-lg">
                <div className="form-group mb-3">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={adminData.username}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="form-group mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={adminData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={adminData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={adminData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNumber"
                    value={adminData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="department" className="form-label">Department</label>
                  <select
                    className="form-control"
                    id="department"
                    name="department"
                    value={adminData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="cs">CS</option>
                    <option value="hr">HR</option>
                    <option value="accounting">Accounting</option>
                    <option value="management">Management</option>
                    <option value="engineering">Engineering</option>
                  </select>
                </div>
                {adminData.role === 'student' && (
                  <>
                    <div className="form-group mb-3">
                      <label>Stream</label>
                      <input
                        type="text"
                        className="form-control"
                        name="stream"
                        value={adminData.stream}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>School Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="schoolCode"
                        value={adminData.schoolCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Region</label>
                      <input
                        type="text"
                        className="form-control"
                        name="region"
                        value={adminData.region}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Zone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zone"
                        value={adminData.zone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={adminData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Woreda</label>
                      <input
                        type="text"
                        className="form-control"
                        name="woreda"
                        value={adminData.woreda}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}
                <div className="form-group mb-3">
                  <label>Image</label>
                  <Dropzone onDrop={handleImageDrop}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()} className="border border-dashed p-4 text-center">
                        <input {...getInputProps()} />
                        {adminData.image ? (
                          <img
                            src={
                              typeof adminData.image === 'string'
                                ? adminData.image
                                : URL.createObjectURL(adminData.image)
                            }
                            alt="Preview"
                            className="w-full h-auto"
                          />
                        ) : (
                          <p>Drag 'n' drop an image here, or click to select one</p>
                        )}
                      </div>
                    )}
                  </Dropzone>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Profile
                </button>
              </form>
            )}
          </div>
        </div>
        <Footeradmin />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminProfile;
