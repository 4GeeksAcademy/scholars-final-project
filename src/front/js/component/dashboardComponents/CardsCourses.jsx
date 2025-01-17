import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext.js";

import Card from "./Card.jsx";

const CardsCourses = () =>{
    const {store, actions} = useContext(Context);

    useEffect(() => {
        actions.handleFetchAllCourses();
        actions.handleFetchUserInfo();
    },[]);

    return(
        <>
            <h1 className='text-center'>All Courses</h1>
            <div className='d-flex justify-content-center'>
                {store.courses ? store.courses.map((course, index) => {
                    return <Card key={index} course={ course }/>
                }) : 'loading...'}
            </div> 
        </>
    )
}

export default CardsCourses;