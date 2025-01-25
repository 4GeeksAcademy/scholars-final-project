import React, { useEffect } from "react";
import { useContext } from "react";
import {Context} from "../../store/appContext.js"

const AddAssignments = () => {
    const { store, actions } = useContext(Context);
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDeadline, setAssignmentDeadline] = useState('');

    // Handle form submission
    const createAssignment = (e) => {
        e.preventDefault(); 
        actions.addAssignment(assignmentTitle, assignmentDeadline); 
    };

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
                <button type="submit" className="btn btn-primary">Create Assignment</button>
            </form>
        </>
    );
}


export default AddAssignments;