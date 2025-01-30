import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext.js";

import Card from "./Card.jsx";

const CardsCourses = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.handleFetchAllCourses();
        actions.handleFetchUserInfo();
    }, []);

    return (
        <>
            <div className='container'>
                <div className='row justify-content-center'>
                    {store.user ? store.user.courses.map((course, index) => {
                        return (
                            <div className='col-4 d-flex justify-content-center my-4' key={index}>
                                <Card key={index} course={course} />
                            </div>
                        )
                    }) : 'loading...'}
                </div>
            </div>
        </>
    )
}

export default CardsCourses;