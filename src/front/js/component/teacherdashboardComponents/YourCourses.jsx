import React from "react";
import { useContext, useEffect } from "react";
import {Context} from "../../store/appContext.js"

import TeacherCard from "./TeacherCard.jsx";

const YourCourses = () =>{
    const {store, actions} = useContext(Context);


    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <h1 className="text-center mt-5">Your Courses</h1>
                    </div>
                </div>
                <div className="row justify-content-center">
                    {store.user && store.user.courses.map((course, index) => {
                        return (
                            <div className="col-4 d-flex justify-content-center my-4" key={index}>
                                <TeacherCard course={course} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default YourCourses;