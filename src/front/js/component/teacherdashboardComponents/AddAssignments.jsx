import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../store/appContext.js";

const AddAssignments = () => {
    const { store, actions } = useContext(Context);

    // State hooks for form fields
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState('');
    const [studentUsername, setStudentUsername] = useState('');
    const [studentId, setStudentId] = useState(null);

    // Function to handle form submission
    const createAssignment = async (e) => {
        e.preventDefault();

        // Check if a student is selected
        if (!studentId) {
            console.error("No student found for this username.");
            return;
        }

        // Ensure the date is valid (YYYY-MM-DD format)
        const isValidDate = (date) => {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(date);
        };

        if (!isValidDate(assignmentDeadline)) {
            console.error("Invalid date format");
            return;
        }

        // Call the action to create the assignment, passing studentId and other details
        try {
            await actions.teacherAddAssignment(assignmentTitle, assignmentDeadline, studentId);
            console.log("Assignment created successfully");
        } catch (error) {
            console.error("Failed to create assignment:", error);
        }
    };

    // Function to handle student username change and lookup
    const handleStudentUsernameChange = (e) => {
        const username = e.target.value;
        setStudentUsername(username);

        // Lookup the student by username
        // const student = store.students.find(student => student.username.toLowerCase() === username.toLowerCase());

        // if (student) {
             setStudentId(student.id); // Set studentId if found
        // } else {
        //     setStudentId(null); // Reset studentId if not found
        // }
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

                    {!studentId && studentUsername && (
                        <div className="text-danger mt-2">Student not found</div>
                    )}
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={!studentId || !assignmentTitle || !assignmentDeadline}
                >
                    Create Assignment
                </button>
            </form>
        </>
    );
};

export default AddAssignments;

