// AnotherModal.jsx
import React, { useState, useEffect } from 'react'; // Import useState
import axios from 'axios';
import Modal from 'react-modal'; 

const customStyles = { // Define customStyles here
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

const AnotherModal = ({ isOpen, onRequestClose, currentExam, role, studentId }) => {
    const [examResults, setExamResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
  
  
    useEffect(() => {
      const fetchExamDetails = async () => {
        if (!isOpen || !currentExam) return; 
        
        try {
          const token = localStorage.getItem('token');
          let resultsResponse;
          let apiUrl = '/api/exam'; //Default is all exams
  
          if (role === 'admin') {
            // For admins, fetch all exam results for the given exam
            resultsResponse = await axios.get(apiUrl, {
              headers: { Authorization: `Bearer ${token}` },
              params: { examId: currentExam._id } // Add examId as a query parameter
            });
          } else {
            // For students, fetch their own exam result for the given exam
            apiUrl = `/api/student/${studentId}/exam/${currentExam._id}`;
            resultsResponse = await axios.get(apiUrl, {
              headers: { Authorization: `Bearer ${token}` },
            });
          }
  
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
      return null;
    }
  
    // 2. Check loading and error state
    if (isLoading) {
      return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Exam Detail Modal" style={customStyles}>
          <div>Loading exam results...</div>
        </Modal>
      );
    }
  
    if (error) {
      return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Exam Detail Modal" style={customStyles}>
          <div>Error: {error}</div>
        </Modal>
      );
    }
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
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
          {/* Display results based on role */}
          {examResults.map((result) => (
            <tr key={result._id}>
              {/* Display student names only for admins */}
              {role === 'admin' && <td>{result.studentId.name}</td>}  
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

export default AnotherModal;
