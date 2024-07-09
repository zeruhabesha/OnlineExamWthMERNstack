import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Navadmin from './Navadmin';
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import Pagination from './Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import ExamDetail from './ExamDetail';
import AnotherModal from './AnotherModal';     // Import AnotherModal


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


const ExamList = () => {
  const [modalType, setModalType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
    status: '0',
  });
  const [currentExam, setCurrentExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(themes[0]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const storedExams = useSelector((state) => state.exam?.exams || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage] = useState(5);
  const [filteredExams, setFilteredExams] = useState([]);
  

  
  const getExams = async () => {
    try {
      const token = localStorage.getItem('token');
      const studentId = localStorage.getItem('id');
  
      if (!token) {
        setError('Token not found in localStorage');
        setIsLoading(false);
        toast.error('Unauthorized: Missing token');
        return;
      }
  
      // Fetch all exams
      const examsResponse = await axios.get('http://localhost:7000/api/exams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allExams = examsResponse.data;
  
      // Fetch exam results for the current student
      const studentExamResults = await Promise.all(
        allExams.map(async (exam) => {
          try {
            const examResultResponse = await axios.get(
              `http://localhost:7000/api/examResults/student/${studentId}/exam/${exam._id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return examResultResponse.data;
          } catch (error) {
            // Handle the case where there is no exam result for the given student and exam
            if (error.response && error.response.status === 404) {
              return null;
            } else {
              throw error;
            }
          }
        })
      );
  
      // Filter out exams that the student has already taken
      const examsNotTaken = allExams.filter((exam, index) => {
        const examResult = studentExamResults[index];
        return !examResult || examResult.length === 0;
      });
  
      setExams(examsNotTaken);
      setFilteredExams(examsNotTaken);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  
  
  



  useEffect(() => {
    getExams();
  }, []);

  useEffect(() => {
    const storedThemeIndex = localStorage.getItem('themeIndex');
    if (storedThemeIndex && themes[storedThemeIndex]) {
      setTheme(themes[storedThemeIndex]);
    }
  }, []);

  const handleThemeChange = (index) => {
    if (themes[index]) {
      setTheme(themes[index]);
      localStorage.setItem('themeIndex', index);
    }
  };

  const handleOpenModal = (type, exam = null) => {
    setIsModalOpen(true);
    setModalType(type);
    setCurrentExam(exam);
    if (exam) {
      setFormData({
        title: exam.title,
        description: exam.description || '',
        questions: exam.questions || [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
      });
    }
  };

  const handleOpenModal1 = (exam = null) => {
    setIsModalOpen1(true);
    setCurrentExam(exam);
    if (exam) {
      setFormData({
        title: exam.title,
        description: exam.description || '',
        questions: exam.questions.map(question => ({
          ...question,
          options: question.options.map(option => ({
            value: option,
            selected: false,
          })),
        })),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        questions: [{ questionText: '', options: [{ value: '', selected: false }] }],
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalOpen1(false);
    setCurrentExam(null);
    setFormData({
      title: '',
      description: '',
      questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = formData.questions.map((question, qIndex) =>
      qIndex === index ? { ...question, [field]: value } : question
    );
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = formData.questions.map((question, qIndex) =>
      qIndex === questionIndex
        ? {
            ...question,
            options: question.options.map((option, oIndex) =>
              oIndex === optionIndex ? value : option
            ),
          }
        : question
    );
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, qIndex) => qIndex !== index);
    setFormData({ ...formData, questions: newQuestions });
  };


  const handleSaveExam = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized: Missing token');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (modalType === 'create') {
        await axios.post('http://localhost:7000/api/exams/', formData, config);
        toast.success('Exam created successfully');
      } else if (modalType === 'edit' && currentExam) {
        await axios.put(`http://localhost:7000/api/exams/${currentExam._id}`, formData, config);
        toast.success('Exam updated successfully');
      }

      await getExams();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving exam:', error);
      toast.error(error.response ? error.response.data.message : 'Failed to save exam');
    }
  };

  const handleOpenDeleteModal = (exam) => {
    setExamToDelete(exam);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setExamToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized: Missing token');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://localhost:7000/api/exams/${examToDelete._id}`, config);
      toast.success('Exam deleted successfully');
      await getExams();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error(error.response ? error.response.data.message : 'Failed to delete exam');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    const filtered = exams.filter((exam) =>
      exam.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredExams(filtered);
  };

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handleCheckboxChange = (questionIndex, optionIndex, isChecked) => {
    const newQuestions = formData.questions.map((question, qIndex) =>
      qIndex === questionIndex
        ? {
            ...question,
            options: question.options.map((option, oIndex) => ({
              ...option,
              selected: oIndex === optionIndex ? isChecked : false // Deselect all other options
            })),
          }
        : question
    );
    setFormData({ ...formData, questions: newQuestions });
  };
  
  
  


  const handleSubmitExam = async () => {
    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      if (!token) {
        toast.error('Unauthorized: Missing token');
        return;
      }
  
      const decodedToken = jwtDecode(token);
      const studentId = id; // Assuming the decoded token has a 'user' object with '_id'
      const examId = currentExam._id; // Ensure this is correctly set to the current exam's ID
  
      const answers = formData.questions.map((question) => ({
        questionId: question._id, // Adjust this based on your data structure
        selectedAnswer: question.options.find((option) => option.selected)?.value || '',
      }));
  
      const examResultData = {
        studentId,
        examId,
        answers,
      };
  
      // POST request to save exam results
      const response = await axios.post('http://localhost:7000/api/examResults', examResultData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success('Exam submitted successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting exam:', error);
      if (error.response && error.response.data.message === 'student is not found') {
        toast.error('Student not found. Please check your credentials.');
      } else {
        toast.error(error.response ? error.response.data.message : 'Failed to submit exam');
      }
    }
  };
  

  // const handleSubmitExam = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const id = localStorage.getItem('id');
      
  //     if (!token) {
  //       toast.error('Unauthorized: Missing token');
  //       return;
  //     }
  
  //     const decodedToken = jwtDecode(token);
  //     const studentId = id; // Assuming the decoded token has a 'user' object with '_id'
  //     const examId = currentExam._id; // Ensure this is correctly set to the current exam's ID
  
  //     console.log('Exam ID:', examId); // Log examId for verification
  
  //     const answers = formData.questions.map((question) => ({
  //       questionId: question._id, // Adjust this based on your data structure
  //       selectedAnswer: question.options.find((option) => option.selected)?.value || '',
  //     }));
  
  //     const examResultData = {
  //       studentId,
  //       examId,
  //       answers,
  //     };
  
  //     // POST request to save exam results
  //     const response = await axios.post('http://localhost:7000/api/examResults', examResultData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (response.status === 200 || response.status === 201) {
  //       // PATCH request to update exam status to 1
  //       const updateResponse = await axios.put(`http://localhost:7000/api/exams/${examId}`, { status: '1' }, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  
  //       if (updateResponse.status === 200 || updateResponse.status === 204) {
  //         toast.success('Exam submitted and status updated successfully');
  //         handleCloseModal();
  //       } else {
  //         throw new Error('Failed to update exam status');
  //       }
  //     } else {
  //       throw new Error('Failed to submit exam');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting exam:', error);
  //     if (error.response && error.response.data.message === 'student is not found') {
  //       toast.error('Student not found. Please check your credentials.');
  //     } else {
  //       toast.error(error.response ? error.response.data.message : 'Failed to submit exam');
  //     }
  //   }
  // };
  
  
  
  const [formDataState, setFormDataState] = useState(formData);

  // Function to handle radio button changes
  const handleRadioChange = (questionIndex, optionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.map((option, index) => ({
      ...option,
      selected: index === optionIndex,
    }));
    setFormData({ ...formData, questions: newQuestions });
  };

  const calculateScore = (answers) => {
    let score = 0;
  
    // Example logic: Loop through answers and calculate score based on correct answers
    answers.forEach((answer) => {
      // Implement your scoring logic based on correct answers
      // This is a simple example, replace it with your actual scoring logic
      if (answer.selectedOptions.length > 0) {
        score += 1; // Increment score for each correct answer selected
      }
    });
  
    return score;
  };
  
  const userRole = localStorage.getItem('role');
  const [navToggle, setNavToggle] = useState(false);
 
  const toggleNav = () => {
    setNavToggle(!navToggle);
  };

  // const [isModalOpen111, setModalOpen] = useState(false);

  // const handleOpenExam = () => {
  //   setModalOpen(true);
  // };

  // const handleCloseModal11 = () => {
  //   setModalOpen(false);
  // };
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
        <br/><br/><br/>
        <h1 className="text-2xl font-bold mb-4">Exam Management</h1>

        <div className="flex mb-4">
          <input
            type="text"
            className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearch}
          />
         {userRole === 'admin' && (
           <button
            onClick={() => handleOpenModal('create')}
            className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Exam
          </button>
         )}
{/* <button
        onClick={handleOpenExam}
        className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        ExamResult
      </button>

      <Modal isOpen={isModalOpen111} onClose={handleCloseModal11}>
        <ExamDetail />
      </Modal> */}
    </div>

  
        {/* </div> */}

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div>
            {currentExams.length === 0 ? (
              <p>No exams found</p>
            ) : (
              <ul>
              {currentExams.map((exam, index) => (
                <li key={exam._id} className="mb-2">
                  <div className="flex items-center">
                    <span className="mr-4">{index + 1}.</span>
                    <h3 className="text-xl font-semibold">{exam.title}</h3>
                  </div>
                  <div className="mt-2 flex space-x-2"> {/* Add space-x-2 for spacing */}
                    {userRole === 'admin' && (
                      <>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          onClick={() => handleOpenModal('edit', exam)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          onClick={() => handleOpenDeleteModal(exam)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleOpenModal1(exam)} 
                    >
                      View Exam
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            
            )}

            <Pagination
              examsPerPage={examsPerPage}
              totalExams={filteredExams.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        )}

        <Footeradmin />
      </section>

      {/* Modal for creating/editing exams */}
      <Modal show={isModalOpen} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'create' ? 'Add Exam' : 'Edit Exam'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Questions</h3>
              {formData.questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`question-${index}`}>
                    Question {index + 1}
                  </label>
                  <input
                    type="text"
                    name={`question-${index}`}
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <div className="mt-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Options</label>
                    {question.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    ))}
                  </div>
                  <div className="mt-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`correctAnswer-${index}`}>
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      name={`correctAnswer-${index}`}
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Remove Question
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Question
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleCloseModal}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
          <button
            onClick={handleSaveExam}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal show={isDeleteModalOpen} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this exam?</Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleCloseDeleteModal}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteExam}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>


      <Modal show={isModalOpen1} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Exam: {formData.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {formData.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-4">
                <h4 className="text-lg font-semibold">Question {questionIndex + 1}</h4>
                <p>{question.questionText}</p>
                <div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mb-2">
                      <input
                        type="radio"
                        id={`option-${questionIndex}-${optionIndex}`}
                        name={`option-${questionIndex}`}
                        checked={option.selected || false}
                        onChange={() => handleRadioChange(questionIndex, optionIndex)}
                      />
                      <label htmlFor={`option-${questionIndex}-${optionIndex}`} className="ml-2">
                        {option.value}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleCloseModal}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
          <button
            onClick={handleSubmitExam}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Exam
          </button>
        </Modal.Footer>
      </Modal>



    </div>
  );
};

export default ExamList;
