import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";




const Card = ({ course }) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
  }, [store.user]);

  const isUserSignedUp = (courseId) => {
    if (!store.user || !store.user.courses) return false;
    const isSignedUp = store?.user?.courses?.some((a) => {
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

  return (
    <>
      <div className="card" style={{ width: "16rem" }}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/022/085/877/non_2x/mathematics-doodle-set-education-and-study-concept-school-equipment-maths-formulas-in-sketch-style-hand-drawn-ector-illustration-isolated-on-white-background-vector.jpg"
          className="card-img-top"
          alt="..."
        />
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

export default Card;
