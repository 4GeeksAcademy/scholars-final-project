import React, {useState} from "react";
import { useContext } from "react";
import {Context} from "../../store/appContext.js"

const Assignments = () => {
    const {store, actions} = useContext(Context);
    const [tasks, setTasks] = useState([
        {id:1, title: "Study React", deadline: "January 15", completed: true},
        {id:2, title: "Study SQL", deadline: "January 20", completed: false},
        {id:3, title: "Study Bootstrap", deadline: "January 22", completed: false}
    ])
    const handleCheckboxChange = (taskId) => {
        const updateTask = store.user.assignments.map((task) =>
            task.id == taskId ? {... task, completed: !task.completed}: task
        )

        setTasks(updateTask);
    }
    return (

        <>
            <div className="container d-flex flex-column justify-content-center align-items-center" style={{minWidth: "75vw"}}>
                <h1 className="text-center mb-4">Assignments</h1>
                <div className="list-group">
                    {store.user.assignments.map((task)=>(
                        <div key={task.id} className="d-flex justify-content-between align-items-center list-group-item" >
                            <div>
                                <h5 className="mb-1">{task.title}</h5>
                                <p className="mb-1 text-muted">Deadline: {task.deadline}</p>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    id={`task-${task.id}`}
                                    checked={task.completed}
                                    onChange={()=>handleCheckboxChange(task.id)}
                                />
                                <label htmlFor={`task-${task.id}`} className="form-check-label">
                                    {task.completed ? <p className="badge rounded-pill bg-success">Completed</p> : <p className="badge rounded-pill bg-warning text-dark">Pending</p>}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Assignments;