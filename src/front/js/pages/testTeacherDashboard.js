import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { SignupModal } from "../component/signupModal";
import { LoginModal } from "../component/loginModal";
import "../../styles/home.css";

export const TestTeacherDashboard = () => {
    const { store, actions } = useContext(Context);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    const handleCreateCourse = () => {
      actions.handleCreateCourse(courseName, courseDescription);
    }

    useEffect(() => {
    }, []);

    return (
      <>
        <div className="text-center mt-5">
          {console.log('store.user', store.user)}
          store.user: {store.user? store.user.username : "no user"} 
          <br/>
          store.courses: {store.courses? store.courses.map(course => course.name) : "no courses"}
          <br/>
          store: {JSON.stringify(store)}
        </div>
        <div>
          <form>
            <div className="form-group">
              <label htmlFor="course_name">course name</label>
              <input type="text" className="form-control" id="course_name" placeholder="name"
                onChange={(e) => setCourseName(e.target.value)} value={courseName}/>
              <label htmlFor="course_description">course description</label>
              <input type="text" className="form-control" id="course_description" placeholder="description"
                onChange={(e) => setCourseDescription(e.target.value)} value={courseDescription}/>
              <button onClick={handleCreateCourse} type="button" className="btn btn-primary">Create Course</button>
            </div>
          </form>
        </div>
      </>
    );
};
