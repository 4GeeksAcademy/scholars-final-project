import React, { useState } from "react";
import { Link } from "react-router-dom";
import TeacherVerticalMenu from "../pages/TeacherVerticalMenu.jsx";

// function NavTabs() {
//     // State to keep track of the active tab
//     const [activeTab, setActiveTab] = useState('home');
  
//     // Function to handle tab clicks
//     const handleTabClick = (tab) => {
//       setActiveTab(tab);
//     };
  
 


const TeacherDashboard = () => {
    return (
        <>
        <div className="row">
            <div className="TeacherVerticalMenu col-2">
                <div className="text-center ms-3 mt-3 ps-3 pe-3">
                    <TeacherVerticalMenu />
                </div>
                
            </div>
            <div className="container d-flex col-8 mt-5">
                <ul class="nav nav-tabs">
                    <li class="nav-item me-1"
                    // onClick={() => handleTabClick('Lesson Plans')}
                    // className={activeTab === 'Lesson Plans' ? 'active' : ''}>
                        ><a class="nav-link active" aria-current="page" href="#">Lesson Plans</a>
                    </li>
                    <li class="nav-item me-1"
                    // onClick={() => handleTabClick('Assignments')}
                    // className={activeTab === 'Assignments' ? 'active' : ''}>
                        ><a class="nav-link active" href="#">Assignments</a>
                    </li>
                    <li class="nav-item me-1">
                        <a class="nav-link active" href="#">Students</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Grades</a>
                    </li>
                </ul>
                </div>
            </div>
            </>
    )
};


export default TeacherDashboard;