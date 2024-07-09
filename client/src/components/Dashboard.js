import Typewriter from "typewriter-effect";
import { TypeAnimation } from 'react-type-animation';

import Sidebar from './Sidebar'
import axios from 'axios';
import { loginSuccess, logout, uploadReadingMaterials, postResult, uploadQuestions } from '../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmins, fetchStudents, fetchViewers } from '../actions/actions';
import React , {useEffect,useState,useRef }from "react";
import './OtherFormtable.css';

import 'react-multi-carousel/lib/styles.css';
import './Nav.css';
import "./style.css";
import Imgd from './images/sample.jpg'
import { Dropdown, Badge } from 'react-bootstrap';
// import { FaBell } from 'react-icons/fa';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import Calendar from 'react-calendar';
import Footeradmin from "./Footeradmin";
import Navadmin from "./Navadmin";
// import { data } from "jquery";


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



const Dashboard = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdmins());
    dispatch(fetchStudents());
    dispatch(fetchViewers());
  }, [dispatch]);

    const toggleSidebar = () => {
        const sidebar = document.querySelector("nav");
        sidebar.classList.toggle("close");
        localStorage.setItem("status", sidebar.classList.contains("close") ? "close" : "open");
      };
      // eslint-disable-next-line no-unused-vars
      const settings = {
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };
      const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3,
          slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2,
          slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          slidesToSlide: 1 // optional, default to 1.
        }
      };
    
    

    
    // This function is used to handle the scroll event and update the state variable  scrolled  with the current scroll position
      const [scrolled, setScrolled] = useState(0);
    
      useEffect(() => {
        const handleScroll = () => {
          setScrolled(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);
    
      const percentScrolled = (scrolled / (document.body.clientHeight - window.innerHeight)) * 100;
    
        const [isCollapsed, setIsCollapsed] = React.useState(false);
        const [isCollapsed1, setIsCollapsed1] = React.useState(false);   
        const [isCollapsed2, setIsCollapsed2] = React.useState(false);
        const [isCollapsed3, setIsCollapsed3] = React.useState(false);
      // This function toggles the collapse state of the "Latest Members" card in the dashboard
        const toggleCollapse = () => {
          setIsCollapsed(!isCollapsed);
        };
        // This function toggles the collapse state of the "Calendar" card in the dashboard
        const toggleCollapse1 = () => {
          setIsCollapsed1(!isCollapsed1);
        };
        // This function toggles the collapse state of the "Map" card in the dashboard.
        const toggleCollapse2 = () => {
          setIsCollapsed2(!isCollapsed2);
        };
        // This function toggles the collapse state of the "Report" card in the dashboard
        const toggleCollapse3 = () => {
          setIsCollapsed3(!isCollapsed3);
        };
    
        // This function is used to toggle between fullscreen and normal screen mode.
        const handleClick = () => {
          const elem = document.documentElement; // Get the root element of the document
        
          if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          ) {
            // If the screen is already in fullscreen mode, exit fullscreen
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          } else {
            // If the screen is not in fullscreen mode, enter fullscreen
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
              elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            }
          }
        };
    
        // This function toggles the dropdown menu for notifications
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
        const handleClick1 = () => {
          setIsDropdownOpen(!isDropdownOpen);
        };
    
    
        // This function toggles the visibility of a popup
        const [showPopup, setShowPopup] = useState(false);
    
        const handleTogglePopup = () => {
          setShowPopup(!showPopup);
        };
    
    
    //  This function toggles the visibility of a calendar component
        const [selectedDate, setSelectedDate] = useState(null);
        const [open, setOpen] = React.useState(false); 
        
        const handleClick5 = () => { 
          setOpen(!open); 
        }; 
        const [organizationName, setOrganizationName] = useState('');
    
        // useEffect(() => {
        //   const user = JSON.parse(localStorage.getItem("userInformation"));
      
        //   if (user && user.oid) {
        //     setOrganizationName(user.organizationNAme);
        //   } else {
        //     console.log("error");
        //   }
        // }, []);
      
        const [theme, setTheme] = useState(themes[0]);

        useEffect(() => {
          const storedThemeIndex = localStorage.getItem('themeIndex');
          if (storedThemeIndex) {
            setTheme(themes[storedThemeIndex]);
          }
        }, []);
      
        const handleThemeChange = (index) => {
          setTheme(themes[index]);
          localStorage.setItem('themeIndex', index);
        };

        const [reports, setReports] = useState([]);
        const [studentsCount, setStudentsCount] = useState(0);
        const [materialsCount, setMaterialsCount] = useState(0);
        
        useEffect(() => {
          const storedThemeIndex = localStorage.getItem('themeIndex');
          if (storedThemeIndex && themes[storedThemeIndex]) {
            setTheme(themes[storedThemeIndex]);
          }
        const fetchData = async () => {
          try {
            const [reportsResponse, studentsResponse, materialsResponse, examResultsResponse] = await Promise.all([
              axios.get('http://localhost:7000/api/reports/count/announcements', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }),
              axios.get('http://localhost:7000/api/reports/count/students', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }),
              axios.get('http://localhost:7000/api/reports/count/reading-materials', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }),
              axios.get('http://localhost:7000/api/reports/count/exams', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              }),
            ]);
    
            console.log('Reports:', reportsResponse.data);
            console.log('Students:', studentsResponse.data);
            console.log('Materials:', materialsResponse.data);
            console.log('Exams:', examResultsResponse.data);
    
            setReports(reportsResponse.data.count);
            setStudentsCount(studentsResponse.data.count);
            setMaterialsCount(materialsResponse.data.count);
            // setExamResults(Array.isArray(examResultsResponse.data) ? examResultsResponse.data : []);
          } catch (error) {
            console.error('Failed to fetch data', error);
          }
        };
    
        fetchData();
      }, []);

      
      const [navToggle, setNavToggle] = useState(false);
 
      const toggleNav = () => {
        setNavToggle(!navToggle);
      };
    

  return (
    <div>
      
     
      <Sidebar navToggle={navToggle} />     
      <section className={`${theme.background} ${theme.textColor} dashboard min-h-screen p-4 flex-1`}>
        {/* <input 
          id="nav-toggle" 
          type="checkbox" 
          checked={navToggle} 
          onChange={toggleNav} 
        /> */}
      <div class="parallelogram" id="one"></div>
<div class="parallelogram" id="two"></div>
<div class="parallelogram" id="three"></div>
<div class="parallelogram" id="four"></div>
<div class="parallelogram" id="five"></div>
<div class="parallelogram" id="six"></div>

      <div class="top" style={{top:`1.2vh`,dispaly:`inline`}}>
      <button class="uil uil-bars sidebar-toggle" onClick={toggleSidebar} style={{dispaly:`inline`}}></button>
      <Navadmin/>
  

      </div>
      <div class="scroll-line" style={{ width: percentScrolled + '%', zIndex:'3'}} />

      <div class="dash-content">

        <div class="main-container">


			<div class="xs-pd-20-10 pd-ltr-20">
        <div class="slider4">
			
  
        <div class="title pb-20">
				 <br/> <br/> 

<div className="word">
     
        <TypeAnimation
          sequence={[
            'Welcome',
            1000,
            'To',
            1000,
          ]}
          wrapper="span"
          speed={50}
          style={{ fontSize: '2em', display: 'inline-block',color: `#18283b` }}
          repeat={Infinity}
        />
   
  
    </div>
 <div><br/>


 </div>

 {/* <div class="ocean">
  <div class="wave"></div>
  <div class="wave"></div>
  <div class="wave"></div>
</div> */}
 </div>
 <div>
	<div class="service-card">
        <div class="service-card-inner">
          <div class="service-card-front">
            <p class="title">Students</p>
          </div>
          <div class="service-card-back">
            <p class="title">
              {studentsCount}
              </p>
          </div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-inner">
          <div class="service-card-front">
            <p class="title">Materials</p>
          </div>
          <div class="service-card-back">
            <p class="title">
            {materialsCount}
              </p>
          </div>
        </div>
      </div>
      <div class="service-card">
        <div class="service-card-inner">
          <div class="service-card-front">
            <p class="title">Announce</p>
          </div>
          <div class="service-card-back">
            <p class="title">
            {reports}
              </p>
          </div>
        </div>
      </div>
	</div>	
</div>


<div className="row">

  <div className="col-md-6">
  <div className="card" style={{borderRadius:`2vh 2vh 0vh 0vh`}}>
      <div className="card-header ones" style={{background: `#18283b`,color:`white`,height: `8vh`, borderRadius: `2vh 2vh 0vh 0vh`}}>
          {/* <h3 className="card-title" style={{display:`inline`}}></h3> */}
          <h3 className="card-title ones1" style={{display:`inline`}}> <i class="far fa-user"></i> &nbsp;Latest Members</h3>
         <div className="card-tools" style={{display:`inline`,float:`right`}}>
            <span className="badge badge-danger">8 New Members</span>
            <button 
              type="button" 
              style={{background:`transparent`,fontSize:`larger`}}
              className="btn btn-tool"
              data-card-widget="collapse"
              onClick={toggleCollapse}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
        <div
          className={`card-body p-0 ${isCollapsed ? "collapse" : ""}`}
           >
          <ul className="users-list clearfix">
            <li>
              <img src={Imgd} alt="User Image"/>
              <a className="users-list-name" href="#">Alexander</a><br/>
              <span className="users-list-date">Today</span>
            </li>
            <li>
            <img src={Imgd} alt="User Image"/>
              <a className="users-list-name" href="#">Normangf</a><br/>
              <span className="users-list-date">Yesterday</span>
            </li>
            <li>
            <img src={Imgd} alt="User Image"/>
              <a className="users-list-name" href="#">Janegfdsg</a><br/>
              <span className="users-list-date">12 Jan</span>
            </li>
            <li>
            <img src={Imgd} alt="User Image"/>
              <a className="users-list-name" href="#">Johngfdf</a><br/>
              <span className="users-list-date">12 Jan</span>
            </li>
            <li>
            <img src={Imgd} alt="User Image"/>
              <a className="users-list-name" href="#">Alexander</a><br/>
              <span className="users-list-date">13 Jan</span>
            </li>
            <li>
            <img src={Imgd} alt="User Image"/>
              <a className="users-list-name" href="#">Sarah</a><br/>
              <span className="users-list-date">14 Jan</span>
            </li>
            <li>
            <img src={Imgd} alt="User Image"/>
              <a className="users-list-name" href="#">Nora</a><br/>
              <span className="users-list-date">15 Jan</span>
            </li>
            <li>
            <img src={Imgd} alt="User Image"/>
              <a className="users-list-name" href="#">Nadia</a><br/>
              <span className="users-list-date">15 Jan</span>
            </li>
          
       {/* style={{backgroundColor:`#3f89f5`,color:`white`}} */}
        <div className="card-footer text-center">
          <a href="javascript:">View All Users</a>
        </div> </ul></div>
      </div>
    </div>
      
    <div className="col-md-6">
    <div className="card" style={{borderRadius:`2vh 2vh 0vh 0vh`}}>
        <div className="card-header ones" style={{background: `#18283b`,color:`white`,height: `8vh`, borderRadius: `2vh 2vh 0vh 0vh`}}>
          <h3 className="card-title ones1" style={{display:`inline`}}> <i class="far fa-calendar-alt"></i>
                  &nbsp;Calendar</h3>

          <div className="card-tools" style={{display:`inline`,float:`right`}}>
            <button 
              type="button" 
              style={{background:`transparent`,fontSize:`larger`}}
              className="btn btn-tool"
              data-card-widget="collapse"
              onClick={toggleCollapse1}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
        <div
          className={`card-body p-0 ${isCollapsed1 ? "collapse" : ""}`}
           >
        <Calendar
        selectedDate={selectedDate} style={{flexGrow: `0`, padding:`1vh`}}
        onChange={date => setSelectedDate(date)} 
      /> </div>
      
      </div>
    </div>
    <div className="col-md-6">
    <div className="card" style={{borderRadius:`2vh 2vh 0vh 0vh`}}>
            <div className="card-header ones" style={{background: `#18283b`,color:`white`,height: `8vh`, borderRadius: `2vh 2vh 0vh 0vh`}}>
          <h3 className="card-title ones1" style={{display:`inline`}}> <i class="far fa-map"></i>
                  &nbsp;Map</h3>

          <div className="card-tools" style={{display:`inline`,float:`right`}}>
            <button 
              type="button" 
              style={{background:`transparent`,fontSize:`larger`}}
              className="btn btn-tool"
              data-card-widget="collapse"
              onClick={toggleCollapse2}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
 
       <div className={`card-body p-0 ${isCollapsed2 ? "collapse" : ""}`}>
      <div id="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1353.4792009078637!2d38.7520194842046!3d9.027905227265627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f18287ac61%3A0x6c03d3567560724c!2sM.k%20Business%20Center!5e0!3m2!1sen!2set!4v1688980322702!5m2!1sen!2set" width="100%" height="500vh" style={{border:`0`}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
       
        </div>
      </div>
    </div> 
    <div className="col-md-6">
      <div className="card" style={{borderRadius: `2vh 2vh 0vh 0vh`}}>
          <h3 className="card-title ones1" style={{display:`inline`}}> <i class="fas fa-chart-pie"></i>
                  &nbsp;Reports</h3>
          <div className="card-tools" style={{display:`inline`,float:`right`}}>
            <button 
              type="button" 
              style={{background:`transparent`,fontSize:`larger`}}
              className="btn btn-tool"
              data-card-widget="collapse"
              onClick={toggleCollapse3}
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>
        <div className={`card-body p-0 ${isCollapsed3 ? "collapse" : ""}`}>
          {/* Add your report content here */}
          <div style={{ padding: '1rem' }}>
            <h5>Quarterly Report</h5>
            <p>Revenue: $10,000</p>
            <p>Profit: $2,000</p>
            <p>Expenses: $8,000</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<Footeradmin/>
</section>
</div>
  );
};

export default Dashboard;
