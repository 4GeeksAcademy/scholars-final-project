import React from "react";

const courses = [
    {
        id: 1,
        name: "Mathematics",
        lessons: [
            {
                id: 101,
                name: "Lesson 1: Algebra",
                notes: ["Note for Algebra"]
            },
            {
                id: 102,
                name: "Lesson 2: Geometry",
                notes: ["Note for Geometry"]
            }
        ]
    },
    {
        id: 2,
        name: "History",
        lessons: [
            {
                id: 201,
                name: "Lesson 1: Middle Age",
                notes: ["Note for Middle Age"]
            },
            {
                id: 202,
                name: "Lesson 2: Renaissance",
                notes: ["Note for Renaissance"]
            }
        ]
    }
]
const CoursesPage = () =>{

    return (
        <>
            <div className="container mt-5">
                <h2 clasName="mb-4">Courses Available</h2>
                <div className="row">
                    {courses.length > 0 ? (
                        courses.map((course) =>(
                            <div className="col-4 mb-4" key={course.id}>
                                <div className="card" style={{ width: "16rem" }}>
                                        <img
                                          src="https://static.vecteezy.com/system/resources/previews/022/085/877/non_2x/mathematics-doodle-set-education-and-study-concept-school-equipment-maths-formulas-in-sketch-style-hand-drawn-ector-illustration-isolated-on-white-background-vector.jpg"
                                          className="card-img-top"
                                          alt="..."
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{course.name}</h5>
                                            <p className="card-text">
                                                Some quick example text to build on the card title and make up the
                                                bulk of the card's content.
                                            </p>
                                            <button type="button" className="btn btn-primary mt-1">
                                                Subscribe
                                            </button>
                                        </div>
                                      </div>
                            </div>
                        ))
                    ):(
                        <p>There are no courses available at this time</p>
                    )}
                </div>

            </div>
        </>
    )
}

export default CoursesPage;