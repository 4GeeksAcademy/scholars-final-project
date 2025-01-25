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
<<<<<<< HEAD
            <div className='d-flex justify-content-center'>
                {store.user ? store.user.courses.map((course, index) => {
                    return <Card key={index} course={ course }/>
                }) : 'loading...'}
            </div>
=======
            <h1 className='text-center'>All Courses</h1>
            <div className='d-flex justify-content-center'>
                {store.courses ? store.courses.map((course, index) => {
                    return <Card key={index} course={ course }/>
                }) : 'loading...'}
            </div> 
>>>>>>> 82fac0b74e03f9d909a58997c63894a5168e87bc
        </>
    )
}

export default CardsCourses;