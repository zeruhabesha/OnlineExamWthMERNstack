import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalExam = ({ closeModal, fetchExams, editMode, exam }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editMode && exam) {
      setTitle(exam.title);
      setDescription(exam.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editMode, exam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && exam) {
        await axios.put(`http://localhost:7000/api/exams/${exam._id}`, { title, description }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:7000/api/exams', { title, description }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      fetchExams();
      closeModal();
    } catch (error) {
      console.error('Failed to save exam', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white w-full md:w-1/2 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{editMode ? 'Edit Exam' : 'Add Exam'}</h2>
          <button onClick={closeModal} className="text-red-600">Close</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editMode ? 'Save Changes' : 'Add Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalExam;
