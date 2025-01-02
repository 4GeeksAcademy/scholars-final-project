import React, {useState, useEffect} from "react";
import "../../../../front/styles/MathCoursePage.css";
import { Link } from "react-router-dom";



const MathCoursePage = () => {

    
    return (
        <>
            <div className="">
                <h1 className="col-6 ms-5 mt-2">Algebra 1 Courses</h1>
                
                <div className="search-courses me-5">
                    <input type="text" placeholder="Search Courses"/>
                    <button type="submit"><i className="search-course-button fa fa-search"></i></button>
                </div>
                <div className="returnToDashboard">
                    <Link to="/dashboard" className='text-primary ms-5 mt-2'>Return to Dashboard</Link>
                </div>
            </div>
            <div className="d-flex justify-content-center">
            <div className="col-1"></div>
            <div className="courses-container col-10 d-flex justify-content-center row row-cols-1 row-cols-md-2 g-4 mt-5">
                <div className="col d-flex justify-content-center">
                    <a href="BACKEND_URL/{}">
                    <div className="card mb-3 mx-4"
                    style={{maxWidth: 740}}>
                        <div className="row g-0">
                            <div className="col-md-4">
                            <img src="https://img.freepik.com/premium-photo/falling-colorful-orderly-numbers-math-study-concept-with-flying-digits-fancy-back-school-mathematics-banner-white-background-falling-numbers-vector-illustration_174187-17610.jpg?semt=ais_hybrid" className="img-fluid rounded-start" alt="..."/>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Lesson 1</h5>
                                    <h3>Instructor: Math and Science YouTube Channel</h3>
                                    <p className="card-text">This course will cover Natural Numbers, Whole Numbers, Integers, Rational Numbers, and so much more!</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
                </div>
                <div className="col d-flex justify-content-center">
                    <div className="card mb-3 mx-4" style={{maxWidth: 740}}>
                        <div className="row g-0">
                            <div className="col-md-4">
                            <img src="https://img.freepik.com/premium-photo/falling-colorful-orderly-numbers-math-study-concept-with-flying-digits-fancy-back-school-mathematics-banner-white-background-falling-numbers-vector-illustration_174187-17610.jpg?semt=ais_hybrid" className="img-fluid rounded-start" alt="..."/>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Lesson 2</h5>
                                    <h3>Instructor: Math and Science YouTube Channel</h3>
                                    <p className="card-text">This course will cover Natural Numbers, Whole Numbers, Integers, Rational Numbers, and so much more!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col d-flex justify-content-center">
                    <div className="card mb-3 mx-4" style={{maxWidth: 740}}>
                        <div className="row g-0">
                            <div className="col-md-4">
                            <img src="https://img.freepik.com/premium-photo/falling-colorful-orderly-numbers-math-study-concept-with-flying-digits-fancy-back-school-mathematics-banner-white-background-falling-numbers-vector-illustration_174187-17610.jpg?semt=ais_hybrid" className="img-fluid rounded-start" alt="..."/>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Lesson 3</h5>
                                    <h3>Instructor: Math and Science YouTube Channel</h3>
                                    <p className="card-text">This course will cover Natural Numbers, Whole Numbers, Integers, Rational Numbers, and so much more!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col d-flex justify-content-center">
                    <div className="card mb-3 mx-4" style={{maxWidth: 740}}>
                        <div className="row g-0">
                            <div className="col-md-4">
                            <img src="https://img.freepik.com/premium-photo/falling-colorful-orderly-numbers-math-study-concept-with-flying-digits-fancy-back-school-mathematics-banner-white-background-falling-numbers-vector-illustration_174187-17610.jpg?semt=ais_hybrid" className="img-fluid rounded-start" alt="..."/>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Lesson 4</h5>
                                    <h3>Instructor: Math and Science YouTube Channel</h3>
                                    <p className="card-text">This course will cover Natural Numbers, Whole Numbers, Integers, Rational Numbers, and so much more!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div></>
    )
};

export default MathCoursePage;