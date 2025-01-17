import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import VerticalMenu from "../component/dashboardComponents/VerticalMenu.jsx";
import { Outlet } from "react-router-dom";

const DashBoard = () =>{

    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (!store.user) {
            window.location.href = "/";
        }
    }, []);

    return(
        <>
            <div className="Dashboard-container d-flex">
                <div className="text-center ms-3 mt-3 ps-3 pe-3">
                    <VerticalMenu />
                </div>

                <div className="ms-5 me-4" style={{position:"relative"}}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default DashBoard;