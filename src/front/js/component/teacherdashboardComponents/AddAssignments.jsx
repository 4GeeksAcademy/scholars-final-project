import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../store/appContext.js";

const AddAssignments = () => {
    const { store, actions } = useContext(Context);

    // State hooks for form fields
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState('');
    const [studentUsername, setStudentUsername] = useState('');

    // Function to handle form submission
    const createAssignment = async (e) => {
        e.preventDefault();

        const isValidDate = (date) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(date);
        };

        if (!isValidDate(assignmentDeadline)) {
            console.error("Invalid date format");
            return;
        }

        try {
            await actions.createNewAssignment(assignmentTitle, assignmentDeadline, studentUsername);
        } catch (error) {
            console.error("Failed to create assignment:", error);
        }
    };

    // Function to handle student username change and lookup
    const handleStudentUsernameChange = (e) => {
        const username = e.target.value;
        console.log("userame: ", username);
        console.log("deadline: ", assignmentDeadline);
        console.log("title: ", assignmentTitle);
        setStudentUsername(username);
    };

    // Ensure the return statement is inside the AddAssignments component function
    return (
        <>
            <h3>Add New Assignment to Students</h3>
            <form onSubmit={createAssignment}>

                <div className="mb-3">
                    <label htmlFor="assignment_title" className="form-label">Assignment Title</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="assignment_title" 
                        aria-describedby="assignment-title"
                        onChange={(e) => setAssignmentTitle(e.target.value)} 
                        value={assignmentTitle}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="assignment_deadline" className="form-label">Assignment Deadline</label>
                    <input 
                        type="date" 
                        className="form-control" 
                        id="assignment_deadline" 
                        aria-describedby="assignment-deadline"
                        placeholder="MM-DD-YYYY"
                        onChange={(e) => setAssignmentDeadline(e.target.value)} 
                        value={assignmentDeadline}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="student_username" className="form-label">Student Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="student_username" 
                        aria-describedby="student_username"
                        placeholder="Enter Student Username"
                        onChange={handleStudentUsernameChange} 
                        value={studentUsername}
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={!studentUsername || !assignmentTitle || !assignmentDeadline}
                >
                    Create Assignment
                </button>
            </form>
        </>
    );
};

export default AddAssignments;

