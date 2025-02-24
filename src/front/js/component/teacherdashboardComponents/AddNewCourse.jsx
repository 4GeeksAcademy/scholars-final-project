import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";
import { SignupModal } from "../signupModal";
import { LoginModal } from "../loginModal";
import "../../../styles/home.css";

export const AddNewCourse = () => {
    const { store, actions } = useContext(Context);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    const handleCreateCourse = () => {
      actions.handleCreateCourse(courseName, courseDescription);
      setCourseName('');
      setCourseDescription('');
    }

    useEffect(() => {
    }, []);

    return (
      <>
        <div className="row justify-content-center">
          <div className="col-12">
              <h1 className="text-center mt-5">Create new Course</h1>
          </div>
        </div>
        <div>
          <form className='mt-5'>
            <div className="d-flex flex-column justify-content-center align-items-center form-group" style={{width: '100%'}}>
              <label htmlFor="course_name">course name</label>
              <input type="text" className="form-control" style={{width: '70%', maxWidth: '400px'}} id="course_name" placeholder="name"
                onChange={(e) => setCourseName(e.target.value)} value={courseName}/>
              <label htmlFor="course_description">course description</label>
              <input type="text" className="form-control" style={{width: '70%', maxWidth: '400px'}} id="course_description" placeholder="description"
                onChange={(e) => setCourseDescription(e.target.value)} value={courseDescription}/>
              <button onClick={handleCreateCourse} type="button" className="btn btn-primary">Create Course</button>
            </div>
          </form>
        </div>
      </>
    );
};

export default AddNewCourse;
