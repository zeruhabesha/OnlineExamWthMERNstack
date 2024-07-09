import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropzone from 'react-dropzone';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import Navadmin from './Navadmin';
import Pagination from './Pagination';

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

const Students = () => {
  const [modalType, setModalType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    stream: '',
    role: 'student',
    blind: false,
    schoolCode: '',
    region: '',
    zone: '',
    city: '',
    woreda: '',
    image: null,
  });
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(themes[0]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const storedAdmins = useSelector((state) => state.admin.admins);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage] = useState(5);
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

    useEffect(() => {
      const storedThemeIndex = localStorage.getItem('themeIndex');
      if (storedThemeIndex && themes[storedThemeIndex]) {
        setTheme(themes[storedThemeIndex]);
      }
    }, []);
  
    useEffect(() => {
      const filtered = admins.filter((admin) =>
        admin.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAdmins(filtered);
      setCurrentPage(1); // Reset to first page after filtering
    }, [searchTerm, admins]);
  
   const handleOpenModal = (type, admin = null) => {
    setIsModalOpen(true);
    setModalType(type);
    setCurrentAdmin(admin);
    if (admin) {
      setFormData({
        username: admin.username,
        password: '', // Assuming password is not retrieved in edit mode for security
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        email: admin.email || '',
        phoneNumber: admin.phoneNumber || '',
        stream: admin.stream || '',
        role: admin.role || 'student',
        blind: admin.blind || false,
        schoolCode: admin.schoolCode || '',
        region: admin.region || '',
        zone: admin.zone || '',
        city: admin.city || '',
        woreda: admin.woreda || '',
        image: admin.image || null, // Ensure the image is set correctly
      });
    } else {
      setFormData({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        stream: '',
        role: 'student',
        blind: false,
        schoolCode: '',
        region: '',
        zone: '',
        city: '',
        woreda: '',
        image: null, // Reset image
      });
    }
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAdmin(null);
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      stream: '',
      role: 'student',
      blind: false,
      schoolCode: '',
      region: '',
      zone: '',
      city: '',
      woreda: '',
      image: null, // Reset image
    });
  };

   const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };
      const response = await axios.get('http://localhost:7000/admin/students', { headers });
      setAdmins(response.data);
      setFilteredAdmins(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
    
  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append('username', formData.username);
    formDataWithImage.append('password', formData.password);
    formDataWithImage.append('firstName', formData.firstName);
    formDataWithImage.append('lastName', formData.lastName);
    formDataWithImage.append('email', formData.email);
    formDataWithImage.append('phoneNumber', formData.phoneNumber);
    formDataWithImage.append('stream', formData.stream);
    formDataWithImage.append('role', formData.role);
    formDataWithImage.append('blind', formData.blind);
    formDataWithImage.append('schoolCode', formData.schoolCode);
    formDataWithImage.append('region', formData.region);
    formDataWithImage.append('zone', formData.zone);
    formDataWithImage.append('city', formData.city);
    formDataWithImage.append('woreda', formData.woreda);
    if (formData.image) {
      formDataWithImage.append('image', formData.image);
    }
  
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      };
  
      if (modalType === 'create') {
        await axios.post('http://localhost:7000/admin/register-student', formDataWithImage, { headers });
        toast.success('Student created successfully');
      } else {
        await axios.put(`http://localhost:7000/admin/update-student/${currentAdmin._id}`, formDataWithImage, { headers });
        toast.success('Student updated successfully');
      }
      fetchAdmins();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save student', error);
      if (error.response) {
        // Log the server response for more details
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        toast.error(`Failed to save student: ${error.response.data.message}`);
      } else {
        toast.error('Failed to save student');
      }
    }
  };
  

  
    const handleOpenDeleteModal = (admin) => {
      setAdminToDelete(admin);
      setIsDeleteModalOpen(true);
    };
  
    const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
    };
  
    const handleDeleteAdmin = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        };
        await axios.delete(`http://localhost:7000/admin/delete-student/${adminToDelete._id}`, { headers });
        toast.success('Student deleted successfully');
        fetchAdmins();
        handleCloseDeleteModal();
      } catch (error) {
        console.error('Failed to delete student', error);
        toast.error('Failed to delete student');
      }
    };
  
    const handleImageDrop = (acceptedFiles) => {
      setFormData({
        ...formData,
        image: acceptedFiles[0],
      });
    };
  
    const indexOfLastAdmin = currentPage * adminsPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
    const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    const handleImageDelete = () => {
      setFormData({
        ...formData,
        image: null,
      });
    };
   const [navToggle, setNavToggle] = useState(false);
 
   
       return (
        <div className={`${theme.background} ${theme.textColor} h-screen dashboard`}>
        <Sidebar navToggle={navToggle} />     
      {/* <section className={`${theme.background} ${theme.textColor} dashboard min-h-screen p-4 flex-1`}> */}
      
                 <div className="flex flex-col w-full">
 <Navadmin />

          <div className="flex flex-col w-full items-center">
            <h1 className="text-4xl font-bold my-4">Student Management</h1>
            <div className="w-full mx-auto flex flex-col items-center">
              <div className="flex flex-col md:flex-row w-full justify-between items-center">
                <div className="w-full md:w-1/3 mx-2">
                <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
                </div>
                <button
                  className={`${theme.primaryColor} btn-primary text-white p-2 rounded hover:bg-opacity-75 my-2 md:my-0 md:mx-2`}
                  onClick={() => handleOpenModal('create')}
                >
                  Add New Student
                </button>
              </div>
  
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={`${theme.primaryColor} text-white`}>
                      <tr>
                  <th className="py-2 px-4 border-b">Username</th>
                  <th className="py-2 px-4 border-b">First Name</th>
                  <th className="py-2 px-4 border-b">Last Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone Number</th>
                  <th className="py-2 px-4 border-b">Stream</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Blind</th>
                  <th className="py-2 px-4 border-b">School Code</th>
                  <th className="py-2 px-4 border-b">Region</th>
                  <th className="py-2 px-4 border-b">Zone</th>
                  <th className="py-2 px-4 border-b">City</th>
                  <th className="py-2 px-4 border-b">Woreda</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="py-2 px-4 border-b">{admin.username}</td>
                    <td className="py-2 px-4 border-b">{admin.firstName}</td>
                    <td className="py-2 px-4 border-b">{admin.lastName}</td>
                    <td className="py-2 px-4 border-b">{admin.email}</td>
                    <td className="py-2 px-4 border-b">{admin.phoneNumber}</td>
                    <td className="py-2 px-4 border-b">{admin.stream}</td>
                    <td className="py-2 px-4 border-b">{admin.role}</td>
                    <td className="py-2 px-4 border-b">{admin.blind ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-4 border-b">{admin.schoolCode}</td>
                    <td className="py-2 px-4 border-b">{admin.region}</td>
                    <td className="py-2 px-4 border-b">{admin.zone}</td>
                    <td className="py-2 px-4 border-b">{admin.city}</td>
                    <td className="py-2 px-4 border-b">{admin.woreda}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleOpenModal('edit', admin)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(admin)}
                        className="text-red-500 hover:text-red-700 ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                    </tbody>
                  </table>
                  <Pagination
                    itemsPerPage={adminsPerPage}
                    totalItems={filteredAdmins.length}
                    currentPage={currentPage}
                    paginate={paginate}
                  />
                </div>
              )}
            </div>
          </div>
          <Footeradmin />
        </div>
  
        <Modal show={isModalOpen} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'create' ? 'Add Student' : 'Edit Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveAdmin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            {modalType === 'create' && (
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="stream" className="form-label">Stream</label>
              <select
                id="stream"
                name="stream"
                value={formData.stream}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="social">Social</option>
                <option value="natural">Natural</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="student">Student</option>
              </select>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="blind"
                name="blind"
                checked={formData.blind}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label htmlFor="blind" className="form-check-label">Blind</label>
            </div>
            <div className="mb-3">
              <label htmlFor="schoolCode" className="form-label">School Code</label>
              <input
                type="text"
                id="schoolCode"
                name="schoolCode"
                value={formData.schoolCode}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="region" className="form-label">Region</label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="zone" className="form-label">Zone</label>
              <input
                type="text"
                id="zone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="woreda" className="form-label">Woreda</label>
              <input
                type="text"
                id="woreda"
                name="woreda"
                value={formData.woreda}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Profile Picture</label>
              <Dropzone onDrop={handleImageDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    {formData.image ? (
                      <p>{formData.image.name}</p>
                    ) : (
                      <p>Drag 'n' drop an image here, or click to select one</p>
                    )}
                  </div>
                )}
              </Dropzone>
            </div>
            <Modal.Footer>
              <button type="button" onClick={handleCloseModal} className="btn btn-secondary">Close</button>
              <button type="submit" className="btn btn-primary">{modalType === 'create' ? 'Add Student' : 'Save Changes'}</button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={isDeleteModalOpen} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this student?</p>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" onClick={handleCloseDeleteModal} className="btn btn-secondary">Cancel</button>
          <button type="button" onClick={handleDeleteAdmin} className="btn btn-danger">Delete</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Students;
