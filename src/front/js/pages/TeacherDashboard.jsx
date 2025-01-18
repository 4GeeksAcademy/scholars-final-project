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
                    <div className="col-5">
                        <div className="card text-center" style={{width:300}}>
                           
                            <div className="card-body">
                                <h5 className="card-title">Course Title</h5>
                                <a href="#" className="btn btn-primary mb-1">Lesson Plans</a> <br/>
                                <a href="#" className="btn btn-primary mb-1">Assignments</a> <br/>
                                <a href="#" className="btn btn-primary">Student List</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="card text-center" style={{width:300}}>
                           
                            <div className="card-body">
                                <h5 className="card-title">Course Title</h5>
                                <a href="#" className="btn btn-primary mb-1">Lesson Plans</a> <br/>
                                <a href="#" className="btn btn-primary mb-1">Assignments</a> <br/>
                                <a href="#" className="btn btn-primary">Student List</a>
                            </div>
                        </div>
                    </div>
                </div>   
            </div>
        </div> 
        </>
    )
};


export default TeacherDashboard;