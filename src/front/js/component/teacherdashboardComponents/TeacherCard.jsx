import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";




const TeacherCard = ({ course }) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
  }, [store.user]);

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
            students: {course.students?.length}
          </p>
          <Link to={`/edit-class-page/${course.id}`}>
            <span className="btn btn-primary btn-lg" href="#" role="button">
              Go to class
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TeacherCard;
