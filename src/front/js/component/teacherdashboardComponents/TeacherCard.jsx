import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";




const TeacherCard = ({ course }) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
  }, [store.user]);

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
            students: {course.students?.length}
          </p>
            <button type="button" className="btn btn-primary mt-1">
              Go to Course
            </button>
        </div>
      </div>
    </>
  );
};

export default TeacherCard;
