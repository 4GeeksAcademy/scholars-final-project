import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext.js";

import Card from "./Card.jsx";

const CardsCourses = () =>{
    const {store, actions} = useContext(Context);

    useEffect(() => {
        console.log('fetching all courses');
        actions.handleFetchAllCourses();
    },[])

    return(
        <>
            <h1 className='text-center'>All Courses</h1>
            <div className='d-flex justify-content-center'>
                {store.courses ? store.courses.map((course, index) => {
                    return <Card key={index} course={ course }/>
                }) : 'loading...'}
            </div>
            <h1 className='text-center'>My Courses</h1>
            <div className='d-flex justify-content-center'>
                {store.courses && store.user? store.courses.map((course, index) => {
                    <></>
                }) : 'loading...'}
            </div>
        </>
    )
}

export default CardsCourses;