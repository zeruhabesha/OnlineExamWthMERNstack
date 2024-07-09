import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navadmin from './Navadmin';
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserCircle, faCommentAlt, faFile, faBullhorn, faWrench, faCalendarAlt, faChartLine, faBookOpen, faUsers, faCog } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

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

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [theme, setTheme] = useState(themes[0]);
  const [themeIndex, setThemeIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalData, setModalData] = useState({ title: '', content: '', image: null });

  useEffect(() => {
    const storedThemeIndex = localStorage.getItem('themeIndex');
    if (storedThemeIndex && themes[storedThemeIndex]) {
      setTheme(themes[storedThemeIndex]);
      setThemeIndex(storedThemeIndex);
    }
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/announcements', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    }
  };

  const handleThemeChange = (index) => {
    if (themes[index]) {
      setTheme(themes[index]);
      setThemeIndex(index);
      localStorage.setItem('themeIndex', index);
    }
  };

  const openModal = (type, announcement = { title: '', content: '', image: null }) => {
    setModalType(type);
    setModalData(announcement);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalData({ title: '', content: '', image: null });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setModalData(prevData => ({ ...prevData, [name]: files[0] }));
    } else {
      setModalData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', modalData.title);
    formData.append('content', modalData.content);
    if (modalData.image) {
      formData.append('image', modalData.image);
    }

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      };

      if (modalType === 'add') {
        await axios.post('http://localhost:7000/api/announcements', formData, { headers });
      } else {
        await axios.put(`http://localhost:7000/api/announcements/${modalData._id}`, formData, { headers });
      }
      closeModal();
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to save announcement', error);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement', error);
    }
  };
  const userRole = localStorage.getItem('role');

  const [navToggle, setNavToggle] = useState(false);
 
  const toggleNav = () => {
    setNavToggle(!navToggle);
  };
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
        <br/><br/><br/>
        <h1 className="text-2xl font-bold mb-4">Announcements</h1>
        <div className="flex justify-end mb-4">
         
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>
          {userRole === 'admin' && (
             <Button variant="primary" onClick={() => openModal('add')} className="mb-4">
            Add Announcement
          </Button>
          )}
          {announcements.length === 0 ? (
            <p>No announcements available</p>
          ) : (
            <div className="card-columns">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="card mb-4">
                  {announcement.image && (
                    <img src={`http://localhost:7000/${announcement.image}`} className="card-img-top" alt={announcement.title} />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{announcement.title}</h5>
                    <p className="card-text">{announcement.content}</p>
                    <p className="card-text"><small className="text-muted">Created At: {new Date(announcement.createdAt).toLocaleString()}</small></p>
                    {userRole === 'admin' && (
                      <>
                    <Button variant="link" onClick={() => openModal('edit', announcement)} className="p-0">
                      Edit
                    </Button>
                    <Button variant="link" onClick={() => deleteAnnouncement(announcement._id)} className="text-danger p-0 ml-2">
                      Delete
                    </Button>
                    </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footeradmin />
      </section>

      {/* Modal for Add/Edit Announcement */}
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Add Announcement' : 'Edit Announcement'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" name="title" value={modalData.title} onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" required />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <textarea id="content" name="content" value={modalData.content} onChange={handleChange} rows="4" className="mt-1 p-2 border border-gray-300 rounded w-full" required></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
              <input type="file" id="image" name="image" onChange={handleChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={closeModal} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {modalType === 'add' ? 'Add' : 'Save'}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Announcements;
