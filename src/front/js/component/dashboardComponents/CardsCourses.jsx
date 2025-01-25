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
            <div className='d-flex justify-content-center'>
                {store.user ? store.user.courses.map((course, index) => {
                    return <Card key={index} course={ course }/>
                }) : 'loading...'}
            </div>
        </>
    )
}

export default CardsCourses;