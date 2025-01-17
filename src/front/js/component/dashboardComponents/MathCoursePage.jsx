import React, {useState, useEffect} from "react";
import "../../../../front/styles/MathCoursePage.css";
import { Link } from "react-router-dom";
import "../../../styles/MathCoursePage.css";

const lessonCardTemplate = document.querySelector("[data-lesson-template]")
const lessonCardContainer = document.querySelector("[data-lesson-container]")
const searchInput = document.querySelector("[data-search]")

let lessons = []

// searchInput.addEventListener("input", (e) => {
//     const value = e.target.value.toLowerCase()
//     lessons.forEach(lesson => {
//         const isVisible = lesson.title.toLowerCase().includes(value) || lesson.author.toLowerCase().includes(value)
//         lesson.element.classList.toggle("hide", !isVisible)
//     })
    
// })

// fetch("...")
//     .then(res => res.json())
//     .then(data => {
//         lessons = data.map(lesson => {

//         const card = lessonCardTemplate.content.cloneNode(true)
//         const header = card.querySelector("[data-header]")
//         const body = card.querySelector("[data-body]")
//         header.textContent = lesson.title
//         body.textContent = lesson.author
//         lessonCardContainer.append(card)
//         return{title: lesson.title, author: lesson.author, element: card}
//         })
//     })

const MathCoursePage = () => {

    
    return (
        <>
            <div className="">
                <h1 className="col-6 ms-5 mt-2">Algebra 1 Courses</h1>
               <div className="returnToDashboard">
                    <Link to="/dashboard" className='text-primary ms-5 mt-2'>Return to Dashboard</Link>
                </div> 
                
                <div className="search-wrapper me-5">
                    <input type="search" id="search" data-search placeholder="Search Courses"/>
                    <button type="submit"><i className="search-course-button fa fa-search"></i></button>
                </div>

            </div>
            <template data-lesson-template>
                <div className="data-lessoncards-container">
                <div className="col d-flex justify-content-center">
                    <a href="BACKEND_URL/{}">
                    <div className="card mb-3 mx-4"
                    style={{maxWidth: 740}}>
                        <div className="row g-0">
                            <div className="col-md-4">
                            <img src="https://img.freepik.com/premium-photo/falling-colorful-orderly-numbers-math-study-concept-with-flying-digits-fancy-back-school-mathematics-banner-white-background-falling-numbers-vector-illustration_174187-17610.jpg?semt=ais_hybrid" className="img-fluid rounded-start" alt="..."/>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body" data-body>
                                    <h5 className="card-title" data-header>Lesson 1</h5>
                                    <h3>Instructor: Math and Science YouTube Channel</h3>
                                    <p className="card-text">This course will cover Natural Numbers, Whole Numbers, Integers, Rational Numbers, and so much more!</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    </a>
                </div>
            </div>
            </template>
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