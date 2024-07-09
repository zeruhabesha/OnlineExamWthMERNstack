import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navadmin from './Navadmin';
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserCircle, faCommentAlt, faFile, faBullhorn, faWrench, faCalendarAlt, faChartLine, faBookOpen, faUsers, faCog } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [theme, setTheme] = useState(themes[0]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    event: '',
    description: '',
    date: '',
    location: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedThemeIndex = localStorage.getItem('themeIndex');
    if (storedThemeIndex && themes[storedThemeIndex]) {
      setTheme(themes[storedThemeIndex]);
    }

    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/schedules' 
      // {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // }
    );
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules', error);
    }
  };

  const handleThemeChange = (index) => {
    if (themes[index]) {
      setTheme(themes[index]);
      localStorage.setItem('themeIndex', index);
    }
  };

  const openEditModal = (schedule) => {
    setSelectedSchedule(schedule);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedSchedule(null);
    setEditModalOpen(false);
  };

  const handleEdit = async (scheduleData) => {
    try {
      await axios.put(`http://localhost:7000/api/schedules/${scheduleData._id}`, scheduleData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      closeEditModal();
      fetchSchedules();
      toast.success('Schedule edited successfully');
    } catch (error) {
      console.error('Failed to edit schedule', error);
      toast.error('Failed to edit schedule');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:7000/api/schedules/${selectedSchedule._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      closeDeleteModal();
      fetchSchedules();
      toast.success('Schedule deleted successfully');
    } catch (error) {
      console.error('Failed to delete schedule', error);
      toast.error('Failed to delete schedule');
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:7000/api/schedules', newSchedule, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      closeAddModal();
      fetchSchedules();
      toast.success('Schedule added successfully');
    } catch (error) {
      console.error('Failed to add schedule', error);
      console.error('Error details:', error.response ? error.response.data : error.message);
      toast.error('Failed to add schedule');
    }
  };

  const openDeleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedSchedule(null);
    setDeleteModalOpen(false);
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setNewSchedule({
      event: '',
      description: '',
      date: '',
      location: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const userRole = localStorage.getItem('role');

  const filteredSchedules = schedules.filter(schedule =>
    schedule.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [navToggle, setNavToggle] = useState(false);
 
  const toggleNav = () => {
    setNavToggle(!navToggle);
  };
  return (
    <div className='flex flex-col min-h-screen'>
    <Sidebar navToggle={navToggle} />     
  <section className={`${theme.background} ${theme.textColor} dashboard min-h-screen p-4 flex-1`}>
    <input 
      id="nav-toggle" 
      type="checkbox" 
      checked={navToggle} 
      onChange={toggleNav} 
    />
      <Navadmin />
        <ToastContainer />
        <br/><br/><br/>
        <h1 className="text-2xl font-bold mb-4">Schedule</h1>
        <div className="flex justify-end mb-4">
          {/* {themes.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThemeChange(index)}
              className={`p-2 m-1 ${theme.hoverBg} ${theme.textColor}`}
            >
              <div className="w-6 h-6 rounded" style={{ backgroundColor: themes[index].primaryColor, border: '1px solid black' }}></div>
            </button>
          ))} */}
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Schedules</h2>
            {userRole === 'admin' && (
              <>
                <Button variant="primary" onClick={openAddModal}>Add Schedule</Button>
              </>
            )}
          </div>
          <div className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {schedules.length > 0 ? (
            <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Event</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSchedules.map((schedule, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{schedule.event}</td>
                  <td className="py-2 px-4 border-b">{schedule.description}</td>
                  <td className="py-2 px-4 border-b">{schedule.date}</td>
                  <td className="py-2 px-4 border-b">{schedule.location}</td>
                  <td className="py-2 px-4 border-b">
                    {userRole === 'admin' && (
                      <>
                        <Button variant="warning" onClick={() => openEditModal(schedule)}>Edit</Button>{' '}
                        <Button variant="danger" onClick={() => openDeleteModal(schedule)}>Delete</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No schedules available.</p>
        )}
           <div className="flex justify-center mt-4">
            <Pagination>
              {Array.from({ length: Math.ceil(filteredSchedules.length / itemsPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      
      </section>
      <Footeradmin />

      {/* Add Modal */}
      <Modal show={addModalOpen} onHide={closeAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEvent">
            <Form.Label>Event</Form.Label>
              <Form.Control
                type="text"
                name="event"
                value={newSchedule.event}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newSchedule.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDate" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={newSchedule.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newSchedule.location}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={editModalOpen} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEvent">
              <Form.Label>Event</Form.Label>
              <Form.Control
                type="text"
                name="event"
                value={selectedSchedule ? selectedSchedule.event : ''}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, event: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={selectedSchedule ? selectedSchedule.description : ''}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDate" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={selectedSchedule ? new Date(selectedSchedule.date).toISOString().substring(0, 16) : ''}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={selectedSchedule ? selectedSchedule.location : ''}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, location: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleEdit(selectedSchedule)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the schedule for "{selectedSchedule ? selectedSchedule.event : ''}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Schedule;
