import React, { useState } from "react";
import { Link } from "react-router-dom";
import TeacherVerticalMenu from "../pages/TeacherVerticalMenu.jsx";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import {Context} from "../store/appContext.js"
import { useLocation } from "react-router-dom";


const TeacherDashboard = () => {
    const {store, actions} = useContext(Context);
    const location = useLocation();
    const isDefaultPage = location.pathname === "/teacherdashboard"
    return (
        <>
        <div className="Dashboard-container d-flex">
            <div className="text-center ms-3 mt-3 ps-3 pe-3">
                 <TeacherVerticalMenu />
            </div>
                
            <div className="ms-5 me-4" style={{position:"relative"}}>
                {isDefaultPage && (<h1>Welcome {store.user && store.user.username}</h1>)}   
                <Outlet />          
            </div>
        </div> 
        </>
    )
};


export default TeacherDashboard;