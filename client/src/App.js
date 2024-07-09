import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ExamList from './components/ExamList';
import ExamDetail from './components/ExamDetail';
import Students from './components/Students';
import Materials from './components/Materials';
import Announcements from './components/Announcements';
import Reports from './components/Reports';
import Schedule from './components/Schedule';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import AdminProfile from './components/AdminProfile';
import Setting from './components/Setting';
import MaterialPage from './pages/MaterialPage'; 
import SchedulePage from './pages/SchedulePage'; 
import AnnouncementPage from './pages/AnnouncementPage';
import HomePage from './pages/HomePage'; 
import Layout from './components/Layout';
import Modal from 'react-modal';

function App() {
  library.add(fas);
  
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      Modal.setAppElement(rootElement);
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/materialpage" element={<MaterialPage />} />
          <Route path="/schedulepage" element={<SchedulePage />} />
          <Route path="/announcementpage" element={<AnnouncementPage />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={<ProtectedRoute element={Admin} requiredRole="admin" />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={Dashboard} />}
          />
          <Route
            path="/report"
            element={<ProtectedRoute element={Reports} requiredRole="admin" />}
          />
          <Route
            path="/announcements"
            element={<ProtectedRoute element={Announcements} />}
          />
          <Route
            path="/schedule"
            element={<ProtectedRoute element={Schedule} />}
          />
          <Route
            path="/materials"
            element={<ProtectedRoute element={Materials} />}
          />
          <Route
            path="/student"
            element={<ProtectedRoute element={Students} requiredRole="admin" />}
          />
          <Route
            path="/exams"
            element={<ProtectedRoute element={ExamList} />}
          />
          <Route
            path="/examdetail"
            element={<ProtectedRoute element={ExamDetail} />}
          />
          {/* <Route
            path="/exam/:id"
            element={<ProtectedRoute element={ExamDetail} />}
          /> */}
          <Route
            path="/adminprofile"
            element={<ProtectedRoute element={AdminProfile} />}
          />
          <Route
            path="/setting"
            element={<ProtectedRoute element={Setting} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
