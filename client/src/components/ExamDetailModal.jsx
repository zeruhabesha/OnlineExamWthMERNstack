import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Assuming you're using react-modal

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '80vh',
    overflow: 'auto',
  },
};

const ExamDetailModal = ({ isOpen, onRequestClose, currentExam, role, studentId }) => {
  const [examResults, setExamResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!isOpen || !currentExam) return; // Guard clause

      try {
        const token = localStorage.getItem('token');
        let apiUrl = 'http://localhost:7000/api/examResults/api/exam'; // Default for admin
        
        if (role !== 'admin') {
          apiUrl = `http://localhost:7000/api/examResults/api/student/${studentId}/exam/${currentExam._id}`;
        }

        const resultsResponse = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExamResults(resultsResponse.data); 
      } catch (error) {
        console.error('Error fetching exam details:', error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamDetails();
  }, [isOpen, currentExam, role, studentId]);

  if (!currentExam) {
    return null; // Don't render until currentExam is available
  }

  if (isLoading) {
    return <div>Loading exam results...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Exam Detail Modal"
      style={customStyles}
    >
      <h2>Exam Detail</h2>
      <h3>Title: {currentExam.title}</h3>
      <p>Description: {currentExam.description}</p>
      <h3>Results:</h3>
      <table className="table">
        <thead>
          <tr>
            {role === 'admin' && <th>Student</th>}
            <th>Score</th>
            <th>Date Taken</th>
          </tr>
        </thead>
        <tbody>
          {examResults.map((result) => (
            <tr key={result._id}>
              {role === 'admin' && <td>{result.studentId?.name}</td>}
              <td>{result.score}</td>
              <td>{new Date(result.takenAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ExamDetailModal;
