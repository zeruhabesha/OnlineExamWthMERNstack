import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarPage from './Navbarpage';

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [schedulesPerPage] = useState(6); // Number of schedules per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/schedules');
        console.log('Response:', response.data); // Log response data for debugging
        setSchedules(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedules:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value || ''; // Ensure query is not undefined or null
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter schedules based on search query
  const filteredSchedules = schedules.filter((schedule) =>
    schedule.title && schedule.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = filteredSchedules.slice(indexOfFirstSchedule, indexOfLastSchedule);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  if (error) {
    return <div>Error fetching schedules. Please try again later.</div>; // Display an error message if fetching fails
  }

  return (
    <div>
      <NavbarPage />
      <div className=" mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Schedule Page</h1>

        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2 border rounded w-full"
          />
        </div>

        {/* Schedule table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {currentSchedules.map((schedule) => (
                <tr key={schedule.id} className="text-gray-800">
                  <td className="border px-4 py-2">{schedule.title}</td>
                  <td className="border px-4 py-2">{schedule.description}</td>
                  <td className="border px-4 py-2">{schedule.date}</td>
                  <td className="border px-4 py-2">{schedule.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredSchedules.length / schedulesPerPage) }, (_, index) => (
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

export default SchedulePage;
