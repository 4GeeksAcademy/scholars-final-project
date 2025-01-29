import React, {useState} from "react";
import { useContext } from "react";
import {Context} from "../../store/appContext.js"

const Assignments = () => {
    const {store, actions} = useContext(Context);

    store.user && store.user.assignments && console.log(store.user.assignments);

    return (
      <div
        className="container d-flex flex-column justify-content-center align-items-center"
        style={{ minWidth: "75vw" }}
      >
        <h1 className="text-center mb-4">Assignments</h1>
        <div className="list-group">
          {store.user && store.user.assignments && store.user.assignments.map((task) => (
            <div
              key={task.id}
              className="d-flex justify-content-between align-items-center list-group-item"
            >
              <div>
                <h5 className="mb-1">{task.title}</h5>
                <p className="mb-1">{task.teacher}</p>
                <p className="mb-1 text-muted">Deadline: {task.deadline}</p>
              </div>
              <div>
                <label htmlFor={`task-${task.id}`} className="form-check-label">
                  {task.completed ? (
                    <p className="badge rounded-pill bg-success">Completed</p>
                  ) : (
                    <p className="badge rounded-pill bg-warning text-dark">Pending</p>
                  )}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
    };


export default Assignments;