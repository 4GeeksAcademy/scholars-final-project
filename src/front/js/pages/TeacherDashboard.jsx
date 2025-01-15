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
            <div className="container row d-flex col-8 mt-5 ms-5">
                <div className="row">
                
                <div className="row">
                        <p>
                            Lesson Plan: Solving Linear Equations
                            Objective:
                        </p>
                        <p>
                            By the end of the lesson, students will be able to:
                        </p>
                        <p>
                            Understand and define linear equations.
                            Solve simple linear equations involving one variable.
                            Apply the concept of balancing both sides of an equation.
                        </p>
                </div>
                </div>   
            </div>
        </div> 
        </>
    )
};


export default TeacherDashboard;