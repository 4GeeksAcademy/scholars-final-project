import React from "react";
import CardsCourses from "../component/dashboard components/CardsCourses.jsx";
import Calendar from "../component/dashboard components/Calendar.jsx";
import Grades from "../component/dashboard components/Grades.jsx";
import Notebook from "../component/dashboard components/Notebooks.jsx";
import Assignments from "../component/dashboard components/Assignments.jsx";
import VerticalMenu from "../component/dashboard components/VerticalMenu.jsx";
import { useEffect } from "react";
import { useState } from "react";

const DashBoard = ({courseActive,calendarActive,assigmentsActive,gradesActive,notebookActive}) =>{
    const [changeContent,setChangeContent]=useState(false);
    return(
        <>
            <div className="Dashboard-container d-flex">
                <div className="text-center ms-3 mt-3 ps-3 pe-3">
                    <VerticalMenu />
                </div>

                <div className="ms-5">
                    {useEffect(()=>{
                        if(courseActive == null && calendarActive == null && assigmentsActive == null && gradesActive == null && notebookActive === null)
                            return(<CardsCourses/>)
                        if(changeContent)
                            setChangeContent(false);
                        setChangeContent(true);
                        console.log(courseActive);
                        if(courseActive)
                            return(<CardsCourses/>)
                        if(calendarActive)
                            return(<Calendar/>)
                        if(assigmentsActive)
                            return(<Assignments/>)
                        if(gradesActive)
                            return(<Grades/>)
                        if(notebookActive)
                            return(<Notebook/>)
                    },[calendarActive,courseActive,assigmentsActive,gradesActive,notebookActive])}
                </div>
            </div>
        </>
    )
}

export default DashBoard;