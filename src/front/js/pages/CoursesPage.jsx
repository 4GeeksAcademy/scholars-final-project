import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { Link } from "react-router-dom";

const CoursesPage = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.handleFetchAllCourses();
    actions.handleFetchUserInfo();
  }, []);

  return (
    <>
      <div className='container'>
        <h1 className='text-center'>All Courses</h1>
        <div className='row justify-content-center'>
          {store.courses ? store.courses.map((course, index) => {
            return (
              <div className='col-3 d-flex justify-content-center my-4' key={index}>
                <EnrollmentCard key={index} course={course} />
              </div>
            )
          }) : 'loading...'}
        </div>
      </div>
    </>
  )
}

export default CoursesPage;




export const EnrollmentCard = ({ course }) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
  }, [store.user]);

  const isUserSignedUp = (courseId) => {
    if (!store.user || !store.user.courses) return false;
    const isSignedUp = store.user.courses.some((a) => {
      return a.id === courseId;
    });
    return isSignedUp;
  };

  const handleAddCourseToStudent = () => {
    actions.handleAddCourseToStudent(course.id);
  }

  const handleDropCourseFromStudent = () => {
    actions.handleDropCourseFromStudent(course.id);
  }

  let color = ['rgb(111, 183, 214)', 'rgb(72, 181, 163)', 'rgb(133, 202, 93)', 'rgb(255, 237, 81)', 'rgb(117,137,191)', 'rgb(252, 169, 133)', 'rgb(165,137,193)', 'rgb(249, 140, 182)'];
  let card_initials = course.name.split(" ").map((word) => word[0]).join("").toLowerCase();
  
  return (
    <>
      <div className="card" style={{ width: "16rem" }}>
        <div className="card-header d-flex justify-content-center" style={{ backgroundColor: color[course.id % color.length] }}>
          <div className="d-flex justify-content-center align-items-center" style={{ width: "8rem", height: "8rem", backgroundColor: color[course.id % color.length] }}>
            <div className="border border-1 rounded-circle d-flex justify-content-center align-items-center" style={{ width: "7rem", height: "7rem", backgroundColor: "white" }}>
              <h2>{card_initials}</h2>
            </div>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{course.name}</h5>
          <p className="card-text">
          </p>
          <p className="card-text">
            {course.description}
          </p>
          <p className="card-text">
            teacher: {course.teacher && course.teacher.username}
          </p>

          {isUserSignedUp(course.id) ? (
            <>
              <button type="button" className="btn btn-primary mt-1" onClick={handleDropCourseFromStudent}>
                Drop Course
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-primary mt-1" onClick={handleAddCourseToStudent}>
                Sign up!
              </button>
            </>)}

        </div>
      </div>
    </>
  );
}; 
