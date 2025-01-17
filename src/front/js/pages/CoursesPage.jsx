import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";

import Card from "../component/dashboardComponents/Card.jsx";


const CoursesPage = () =>{
    const {store, actions} = useContext(Context);

    useEffect(() => {
        actions.handleFetchAllCourses();
        actions.handleFetchUserInfo();
    },[]);

    return (
        <>
            <h1 className='text-center'>All Courses</h1>
            <div className='d-flex justify-content-center'>
                {store.courses ? store.courses.map((course, index) => {
                    return <Card key={index} course={ course }/>
                }) : 'loading...'}
            </div>
            
            <div className='d-flex justify-content-center'>
                {store.user && <h1 className='text-center'>My Courses</h1>}
                {store.user ? store.user.courses.map((course, index) => {
                    return <Card key={index} course={ course }/>
                }) : 'loading...'}
            </div>
        </>
    )
}

export default CoursesPage;