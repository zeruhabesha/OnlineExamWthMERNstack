import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navadmin from './Navadmin';
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import { saveAs } from 'file-saver';
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

const Materials = () => {
  const [readingMaterials, setReadingMaterials] = useState([]);
  const [theme, setTheme] = useState(themes[0]);
  const [viewMode, setViewMode] = useState('list');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const materialsPerPage = 5;

  useEffect(() => {
    const storedThemeIndex = localStorage.getItem('themeIndex');
    if (storedThemeIndex && themes[storedThemeIndex]) {
      setTheme(themes[storedThemeIndex]);
    }

    const fetchReadingMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/reading-materials/all'
        // , {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // }
      );
        setReadingMaterials(response.data);
      } catch (error) {
        console.error('Failed to fetch reading materials', error);
      }
    };

    fetchReadingMaterials();
  }, []);

  const handleThemeChange = (index) => {
    if (themes[index]) {
      setTheme(themes[index]);
      localStorage.setItem('themeIndex', index);
    }
  };

  const handleFileChange = (event) => {
    setNewMaterial({ ...newMaterial, file: event.target.files[0] });
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', newMaterial.title);
    formData.append('description', newMaterial.description);
    formData.append('file', newMaterial.file);

    try {
      await axios.post('http://localhost:7000/api/reading-materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setModalIsOpen(false);
      setNewMaterial({ title: '', description: '', file: null });
      const response = await axios.get('http://localhost:7000/api/reading-materials/all'
      // , {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // }
    );
      setReadingMaterials(response.data);
    } catch (error) {
      console.error('Failed to upload reading material', error);
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:7000/api/reading-materials/${selectedMaterial._id}`, selectedMaterial, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEditModalIsOpen(false);
      setSelectedMaterial(null);
      const response = await axios.get('http://localhost:7000/api/reading-materials/all'
      // , {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // }
    );
      setReadingMaterials(response.data);
    } catch (error) {
      console.error('Failed to edit reading material', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:7000/api/reading-materials/${selectedMaterial._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDeleteModalIsOpen(false);
      setSelectedMaterial(null);
      const response = await axios.get('http://localhost:7000/api/reading-materials/all'
      // , {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // }
    );
      setReadingMaterials(response.data);
    } catch (error) {
      console.error('Failed to delete reading material', error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredMaterials = readingMaterials.filter((material) =>
    material.title.toLowerCase().includes(searchQuery) || material.description.toLowerCase().includes(searchQuery)
  );

  const pageCount = Math.ceil(filteredMaterials.length / materialsPerPage);
  const offset = currentPage * materialsPerPage;
  const currentMaterials = filteredMaterials.slice(offset, offset + materialsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const userRole = localStorage.getItem('role');

  const handleDownload = async (materialId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/reading-materials/download/${materialId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      saveAs(response.data, fileName);
    } catch (error) {
      console.error('Error downloading file', error);
    }
  };
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
      <ToastContainer />
        <h1 className="text-2xl font-bold mb-4">Reading Materials</h1>
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
        <div className="flex justify-end mb-4">
          <button onClick={() => setViewMode('list')} className="p-2 m-1 bg-gray-200 hover:bg-gray-300">List View</button><br/>
          <button onClick={() => setViewMode('grid')} className="p-2 m-1 bg-gray-200 hover:bg-gray-300">Grid View</button>
          {userRole === 'admin' && (
          <button onClick={() => setModalIsOpen(true)} className="p-2 m-1 bg-green-500 hover:bg-green-600 text-white">Upload New Material</button>
          )}
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Available Reading Materials</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search materials..."
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          /><br/><br/><br/>
          {readingMaterials.length === 0 ? (
            <p>No reading materials available</p>
          ) : (
            viewMode === 'list' ? (
              <ul>
  {currentMaterials.map((material) => (
    <li key={material._id} className="border p-2 mb-2 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex-1 mb-2 md:mb-0">
        <h3 className="text-lg font-semibold">{material.title}</h3>
        <p>{material.description}</p>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center">
        <button
          onClick={() => handleDownload(material._id, material.title)}
          className="p-2 m-1 bg-green-500 hover:bg-green-600 text-white"
        >
          Download
        </button>
        {userRole === 'admin' && (
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <button
              onClick={() => {
                setSelectedMaterial(material);
                setEditModalIsOpen(true);
              }}
              className="p-2 m-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setSelectedMaterial(material);
                setDeleteModalIsOpen(true);
              }}
              className="p-2 m-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </li>
  ))}
</ul>

            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentMaterials.map((material) => (
                  <div key={material._id} className="border p-4 rounded shadow-md">
                    <h3 className="text-lg font-semibold">{material.title}</h3>
                    <p>{material.description}</p>
                    <div className="mt-2 flex items-center">
                      <button
                        onClick={() => handleDownload(material._id, material.title)}
                        className="p-2 m-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        Download
                      </button>
                      {userRole === 'admin' && (
                        <div>
                          <button
                            onClick={() => {
                              setSelectedMaterial(material);
                              setEditModalIsOpen(true);
                            }}
                            className="p-2 m-1 bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMaterial(material);
                              setDeleteModalIsOpen(true);
                            }}
                            className="p-2 m-1 bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
          />
        </div>
      </section>
      <Footeradmin />

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Upload Reading Material">
        <h2>Upload Reading Material</h2>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={newMaterial.title}
              onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={newMaterial.description}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">File</label>
            <input type="file" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={() => setModalIsOpen(false)} className="p-2 m-1 bg-gray-500 hover:bg-gray-600 text-white">
              Cancel
            </button>
            <button type="submit" className="p-2 m-1 bg-green-500 hover:bg-green-600 text-white">
              Upload
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)} contentLabel="Edit Reading Material">
        <h2>Edit Reading Material</h2>
        {selectedMaterial && (
          <form onSubmit={handleEdit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={selectedMaterial.title}
                onChange={(e) => setSelectedMaterial({ ...selectedMaterial, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={selectedMaterial.description}
                onChange={(e) => setSelectedMaterial({ ...selectedMaterial, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setEditModalIsOpen(false)} className="p-2 m-1 bg-gray-500 hover:bg-gray-600 text-white">
                Cancel
              </button>
              <button type="submit" className="p-2 m-1 bg-blue-500 hover:bg-blue-600 text-white">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={deleteModalIsOpen} onRequestClose={() => setDeleteModalIsOpen(false)} contentLabel="Delete Reading Material">
        <h2>Delete Reading Material</h2>
        <p>Are you sure you want to delete this reading material?</p>
        <div className="flex justify-end">
          <button type="button" onClick={() => setDeleteModalIsOpen(false)} className="p-2 m-1 bg-gray-500 hover:bg-gray-600 text-white">
            Cancel
          </button>
          <button type="button" onClick={handleDelete} className="p-2 m-1 bg-red-500 hover:bg-red-600 text-white">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Materials;
