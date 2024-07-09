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
import Pagination from './Pagination';  // Assuming you have a Pagination component

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


  const Admin = () => {
    const [modalType, setModalType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department:'',
      role: 'admin',
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
          department: admin.department || '',
          role: admin.role || 'admin',
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
          department:'',
          role: 'admin',
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
        department:'',
        role: 'admin',
        image: null, // Reset image
      });
    };
  
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        };
        const response = await axios.get('http://localhost:7000/admin/admins', { headers });
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
      formDataWithImage.append('department', formData.department);
      formDataWithImage.append('role', formData.role);
      if (formData.image) {
        formDataWithImage.append('image', formData.image);
      }
  
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        };
  
        if (modalType === 'create') {
          await axios.post('http://localhost:7000/admin/register-admin', formDataWithImage, { headers });
          toast.success('Admin created successfully');
        } else {
          await axios.put(`http://localhost:7000/admin/update-admin/${currentAdmin._id}`, formDataWithImage, { headers });
          toast.success('Admin updated successfully');
        }
        fetchAdmins();
        handleCloseModal();
      } catch (error) {
        console.error('Failed to save admin', error);
        toast.error('Failed to save admin');
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
  
    const handleConfirmDelete = async () => {
      if (!adminToDelete) return;
      try {
        await axios.delete(`http://localhost:7000/admin/delete-admin/${adminToDelete._id}`);
        setAdmins(admins.filter((admin) => admin._id !== adminToDelete._id));
        setFilteredAdmins(filteredAdmins.filter((admin) => admin._id !== adminToDelete._id));
        setIsDeleteModalOpen(false);
        toast.success('Admin deleted successfully');
      } catch (error) {
        console.error('Error deleting admin', error);
        toast.error('Failed to delete admin');
      }
    };
  
    const handleImageDrop = (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFormData({ ...formData, image: file });
      }
    };
  
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const indexOfLastAdmin = currentPage * adminsPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
    const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    const [navToggle, setNavToggle] = useState(false);
 
    const toggleNav = () => {
      setNavToggle(!navToggle);
    };

    const [scrolled, setScrolled] = useState(0);
    
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const percentScrolled = (scrolled / (document.body.clientHeight - window.innerHeight)) * 100;
    return (
      <div>
      <Sidebar navToggle={navToggle} />     
    <section className={`${theme.background} ${theme.textColor} dashboard min-h-screen p-4 flex-1`}>
      <input 
        id="nav-toggle" 
        type="checkbox" 
        checked={navToggle} 
        onChange={toggleNav} 
      />
        <Navadmin />
        <div class="scroll-line" style={{ width: percentScrolled + '%', zIndex:'3'}} />
          <div className="flex flex-col w-full items-center">
            <h1 className="text-4xl font-bold my-4">Admin Management</h1>
            <div className="w-full mx-auto flex flex-col items-center">
              <div className="flex flex-col md:flex-row w-full justify-between items-center">
                <div className="w-full md:w-1/3 mx-2">
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Search by username"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <button
                  className={`${theme.primaryColor} btn-primary text-white p-2 rounded hover:bg-opacity-75 my-2 md:my-0 md:mx-2`}
                  onClick={() => handleOpenModal('create')}
                >
                  Add New Admin
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
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">First Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Last Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentAdmins.map((admin) => (
                        <tr key={admin._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{admin.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{admin.firstName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{admin.lastName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{admin.phoneNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{admin.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{admin.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {admin.image && (
                              <img
                                src={`http://localhost:7000/${admin.image}`}
                                alt={admin.username}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="bg-yellow-500 text-white p-2 rounded mx-1 hover:bg-yellow-600"
                              onClick={() => handleOpenModal('edit', admin)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 text-white p-2 rounded mx-1 hover:bg-red-600"
                              onClick={() => handleOpenDeleteModal(admin)}
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
        </section>
  
        <Modal show={isModalOpen} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{modalType === 'create' ? 'Add New Admin' : 'Edit Admin'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSaveAdmin}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={modalType === 'create'}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <select
                  className="form-control"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="cs">cs</option>
                  <option value="hr">hr</option>
                  <option value="accounting">Accounting</option>
                  <option value="management">Management</option>
                  <option value="engineering">Engineering</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  className="form-control"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <Dropzone onDrop={handleImageDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: 'dropzone' })}>
                      <input {...getInputProps()} />
                      {formData.image ? (
                        formData.image instanceof File ? (
                          <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Admin"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <p>Invalid file type</p>
                        )
                      ) : (
                        <p>Drag & drop an image here, or click to select one</p>
                      )}
                    </div>
                  )}
                </Dropzone>
              </div>
              <button type="submit" className="btn btn-primary">
                {modalType === 'create' ? 'Add Admin' : 'Update Admin'}
              </button>
            </form>
          </Modal.Body>
        </Modal>
  
        <Modal show={isDeleteModalOpen} onHide={handleCloseDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Admin</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this admin?</Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>Cancel</button>
            <button className="btn btn-danger" onClick={handleConfirmDelete}>Delete</button>
          </Modal.Footer>
        </Modal>
        <ToastContainer />
      </div>
    );
  };
  
  export default Admin;