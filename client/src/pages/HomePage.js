import React from 'react';
import NavbarPage from './Navbarpage';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

const HomePage = () => {
  return (
    <div>
      <NavbarPage />
      <div className="mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to the Online Exam System</h1>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar (if needed) */}
          <div className="col-span-1 md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
              <ul className="space-y-3">
                <li>
                  <a href="#materials" className="text-blue-600 hover:text-blue-700">View Materials</a>
                </li>
                <li>
                  <a href="#schedule" className="text-blue-600 hover:text-blue-700">View Schedule</a>
                </li>
                <li>
                  <a href="#announcements" className="text-blue-600 hover:text-blue-700">View Announcements</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            {/* Materials Section */}
            <section id="materials" className="slide-in-bottom">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Materials</h2>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">
                    The Materials section ensures that all study materials, lecture notes, reference books, and other educational resources are readily available to students in one centralized location.
                  </p>
                  <Link to="/materialpage" className="text-blue-600 hover:text-blue-700">Explore Materials &rarr;</Link>
                </div>
                {/* Example image (adjust src and alt attributes accordingly) */}
                <img src="/path/to/materials-image.jpg" alt="Materials Image" className="w-32 h-32 rounded-md object-cover ml-4 hidden md:block" />
              </div>
            </section>

            {/* Schedule Section */}
            <section id="schedule" className="slide-in-bottom">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Schedule</h2>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">
                    Provides a clear and organized view of all exam dates, deadlines, and related events.
                  </p>
                  <Link to="/schedulepage" className="text-blue-600 hover:text-blue-700">View Schedule &rarr;</Link>
                </div>
                {/* Example image (adjust src and alt attributes accordingly) */}
                <img src="/path/to/schedule-image.jpg" alt="Schedule Image" className="w-32 h-32 rounded-md object-cover ml-4 hidden md:block" />
              </div>
            </section>

            {/* Announcements Section */}
            <section id="announcements" className="slide-in-bottom">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Announcements</h2>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">
                    Acts as a central platform for sharing critical information such as exam schedules, policy changes, system updates, and important reminders.
                  </p>
                  <Link to="/announcementpage" className="text-blue-600 hover:text-blue-700">Read More &rarr;</Link>
                </div>
                {/* Example image (adjust src and alt attributes accordingly) */}
                <img src="/path/to/announcements-image.jpg" alt="Announcements Image" className="w-32 h-32 rounded-md object-cover ml-4 hidden md:block" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
