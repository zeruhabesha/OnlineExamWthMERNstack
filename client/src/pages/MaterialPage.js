import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarPage from './Navbarpage';
import { saveAs } from 'file-saver';

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [materialsPerPage] = useState(5); // Number of materials per page
  const [maxPageButtons] = useState(3); // Maximum number of pagination buttons
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/reading-materials/all');
        setMaterials(response.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
        setError('Error fetching materials. Please try again later.');
      }
    };

    fetchMaterials();
  }, []);

  const handleDownload = async (materialId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/reading-materials/download/${materialId}`
      , {
        responseType: 'blob',
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`
    //     }
      }
    );

      saveAs(response.data, fileName);
    } catch (error) {
      console.error('Error downloading file', error);
      setError('Error downloading file. Please try again later.');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastMaterial = currentPage * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirstMaterial, indexOfLastMaterial);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the number of pagination buttons to display
  const totalButtons = Math.ceil(filteredMaterials.length / materialsPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(startPage + maxPageButtons - 1, totalButtons);

  const paginationButtons = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <div>
      <NavbarPage />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Materials Page</h1>
        
        <div className="flex justify-between">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2 border rounded w-full max-w-md"
          />
          <div className="flex ml-4">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 mr-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} rounded hover:bg-blue-700 transition duration-300`}
            >
              List View
            </button>
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} rounded hover:bg-blue-700 transition duration-300`}
            >
              Grid View
            </button>
          </div>
        </div>

        {view === 'list' ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">List View</h2>
            <ul className="space-y-4">
              {currentMaterials.map((material) => (
                <li key={material.id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{material.title}</h3>
                  <p className="text-gray-600">{material.description}</p>
                  <button
                    onClick={() => handleDownload(material._id, `${material.title}.pdf`)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Grid View</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentMaterials.map((material) => (
                <div key={material.id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{material.title}</h3>
                  <p className="text-gray-600">{material.description}</p>
                  <button
                    onClick={() => handleDownload(material._id, `${material.title}.pdf`)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex mt-4">
          {paginationButtons.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={`px-4 py-2 mx-1 ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} rounded hover:bg-blue-700 transition duration-300`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        {error && <div className="text-red-600 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default MaterialPage;
