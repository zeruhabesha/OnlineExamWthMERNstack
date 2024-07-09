import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarPage from './Navbarpage';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [announcementsPerPage] = useState(6);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value || '';
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <NavbarPage />
      <div className="mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Announcements Page</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2 border rounded w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentAnnouncements.map((announcement) => (
            <div key={announcement.id} className="bg-white p-6 rounded-lg shadow-md">
              {announcement.image && (
                <img src={`http://localhost:7000/${announcement.image}`} className="w-full h-48 object-cover rounded-lg mb-4" alt={announcement.title} />
              )}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{announcement.title}</h2>
              <p className="text-gray-600 mb-4">{announcement.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600">{announcement.date}</span>
                <span className="text-gray-500">{announcement.author}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredAnnouncements.length / announcementsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 mx-1 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'} rounded hover:bg-blue-700 transition duration-300`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;
