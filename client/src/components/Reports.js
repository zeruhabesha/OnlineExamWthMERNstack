import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navadmin from './Navadmin';
import Sidebar from './Sidebar';
import Footeradmin from './Footeradmin';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

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

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [examResults, setExamResults] = useState([]);
  const [topExamResults, setTopExamResults] = useState([]);
  const [theme, setTheme] = useState(themes[0]);

  useEffect(() => {
    const storedThemeIndex = localStorage.getItem('themeIndex');
    if (storedThemeIndex && themes[storedThemeIndex]) {
      setTheme(themes[storedThemeIndex]);
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
    
        const [
          reportsResponse,
          studentsResponse,
          materialsResponse,
          examResultsResponse,
          topExamResultsResponse,
        ] = await Promise.all([
          axios.get('http://localhost:7000/api/reports/count/announcements', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:7000/api/reports/count/students', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:7000/api/reports/count/materials', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:7000/api/exam-results', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:7000/api/exam-results/top', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
    
        console.log('Reports:', reportsResponse.data);
        console.log('Students:', studentsResponse.data);
        console.log('Materials:', materialsResponse.data);
        console.log('Exams:', examResultsResponse.data);
        console.log('Top Exams:', topExamResultsResponse.data);
    
        setReports(reportsResponse.data.count);
        setStudentsCount(studentsResponse.data.count);
        setMaterialsCount(materialsResponse.data.count);
        setExamResults(examResultsResponse.data);
        setTopExamResults(topExamResultsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, []);

  const handleThemeChange = (index) => {
    if (themes[index]) {
      setTheme(themes[index]);
      localStorage.setItem('themeIndex', index);
    }
  };

  const passRateData = {
    labels: examResults.map((result) => result.examName),
    datasets: [
      {
        label: 'Pass Rate',
        data: examResults.map((result) => result.passRate),
        backgroundColor: theme.primaryColor,
      },
    ],
  };

  return (
    <div className={`flex flex-col ${theme.background} ${theme.textColor}`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navadmin />
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg shadow-md ${theme.beforeBg}`}>
                <h2 className="text-lg font-bold">Announcements Count</h2>
                <p className="text-2xl">{reports}</p>
              </div>
              <div className={`p-4 rounded-lg shadow-md ${theme.beforeBg}`}>
                <h2 className="text-lg font-bold">Students Count</h2>
                <p className="text-2xl">{studentsCount}</p>
              </div>
              <div className={`p-4 rounded-lg shadow-md ${theme.beforeBg}`}>
                <h2 className="text-lg font-bold">Materials Count</h2>
                <p className="text-2xl">{materialsCount}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Exam Pass Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examResults.map((result) => (
                  <div key={result.examName} className={`p-4 rounded-lg shadow-md ${theme.beforeBg}`}>
                    <h3 className="text-lg font-bold">{result.examName}</h3>
                    <p className="text-xl">Pass Rate: {result.passRate.toFixed(2)}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Top 10 Exam Results</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topExamResults.map((result) => (
                      <tr key={result._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{result.studentId.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{result.examId.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{result.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Footeradmin />
        </div>
      </div>
    </div>
  );
};

export default Reports;
