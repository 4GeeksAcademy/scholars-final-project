import React from "react";
import { Link } from "react-router-dom";

const Card = () =>{

    return(
        <>
            <div className="card" style={{"width": "16rem"}}>
                <img src="https://static.vecteezy.com/system/resources/previews/022/085/877/non_2x/mathematics-doodle-set-education-and-study-concept-school-equipment-maths-formulas-in-sketch-style-hand-drawn-ector-illustration-isolated-on-white-background-vector.jpg" className="card-img-top" alt="..."/>
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <button type="button" className="btn btn-primary mt-1">
                        <Link to="/mathcoursepage" className='text-decoration-none text-reset '>View Math Courses</Link>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Card;