import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navadmin from './Navadmin';
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
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

const ExamDetail = () => {
  const [examResults, setExamResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5); // Number of results per page
  const [exams, setExams] = useState([]);
  const role = localStorage.getItem('role');
  const studentID = localStorage.getItem('id');

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        let url;
        if (role === 'admin') {
          url = 'http://localhost:7000/api/examResults';
        } else {
          url = `http://localhost:7000/api/examResults/student/${studentID}`;
        }

        const response = await axios.get(url, config);
        setExamResults(response.data);
        setFilteredResults(response.data); // Initialize filtered results with all data
      } catch (error) {
        console.error('Error fetching exam results:', error);
      }
    };

    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:7000/api/exams', config);
        setExams(response.data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExamResults();
    fetchExams();
  }, [role, studentID]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterResults(event.target.value);
  };

  const filterResults = (term) => {
    if (term === '') {
      setFilteredResults(examResults); // Reset to all results when search term is empty
    } else {
      const filtered = examResults.filter(result =>
        result.studentId.username.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredResults(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getExamTitle = (examId) => {
    const exam = exams.find(exam => exam._id === examId);
    return exam ? exam.title : 'Unknown'; // Return title or 'Unknown' if not found
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [navToggle, setNavToggle] = useState(false);
  const toggleNav = () => {
    setNavToggle(!navToggle);
  };

  const theme = themes[0]; // Set your theme index here

  return (
    <div className='flex flex-col min-h-screen'>
      <Sidebar navToggle={navToggle} />     
      <section className={`${theme.background} ${theme.textColor} dashboard min-h-screen p-4 flex-1`}>
        <Navadmin />
        <ToastContainer />
        <br/><br/><br/>
        <h1 className="text-2xl font-bold mb-4">Result</h1>
        
        {/* Search bar */}
        <input
          type="text"
          className="px-2 py-1 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Search by Student ID"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white text-black">
            <thead>
              <tr>
                <th className="py-2">Student ID</th>
                <th className="py-2">Exam Title</th>
                <th className="py-2">Score</th>
                <th className="py-2">Taken At</th>
                
              </tr>
            </thead>
            <tbody>
              {currentResults.map((result) => (
                <tr key={result._id}>
                  <td className="border px-4 py-2">{result.RegNo}</td>
                                    <td className="border px-4 py-2">{getExamTitle(result.examId)}</td>
<td className="border px-4 py-2">{result.score}</td>
                  <td className="border px-4 py-2">{new Date(result.takenAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <nav className="block">
            <ul className="flex pl-0 list-none rounded my-2">
              {Array(Math.ceil(filteredResults.length / resultsPerPage))
                .fill()
                .map((_, index) => (
                  <li key={index}>
                    <button
                      className={`px-3 py-1 rounded-md hover:bg-gray-800 ${
                        currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-700 text-white'
                      }`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </section>
      <Footeradmin />  
    </div>
  );
};

export default ExamDetail;
