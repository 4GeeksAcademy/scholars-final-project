import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        if (!sessionStorage.jwtToken) {
            window.location.href = "/";
        }
    }, []);

    return (
        <>
        <div className="Dashboard-container d-flex" style={{ width: "100%", justifyContent: "center" }}>
            <div className="text-center ms-3 mt-3 ps-3 pe-3">
                 <TeacherVerticalMenu />
            </div>
                
            <div className="d-flex flex-column align-items-center" style={{ width: "100%", position: "relative" }}>
                {console.log(store.user)}
                {isDefaultPage && (<h1>Welcome {store.user && store.user.username}</h1>)}   
                <Outlet />          
            </div>
        </div> 
        </>
    )
};


export default TeacherDashboard;