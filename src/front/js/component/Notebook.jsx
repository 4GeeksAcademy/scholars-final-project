import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
const Notebook = ({noteID, getcontent}) => {
  const [content, setContent] = useState(getcontent);
  useEffect(()=>{setContent(getcontent)},[getcontent]);
  const { store, actions } = useContext(Context);
  return (
    <div className="d-flex flex-column align-items-center p-3">
      <div
        className="card"
        style={{
          width: "100%",
          //   background: 'url("/path-to-paper-background.jpg")',
          //   backgroundSize: "cover",
          padding: "20px",
          minHeight: "300px",
          display: "flex", // Added flex to stretch child
          flexDirection: "column", // Ensure vertical stacking
        }}
      >
        <textarea
          className="form-control border-0"
          style={{
            flex: "1", // Allows textarea to fill available space
            width: "100%",
            background: "transparent",
            resize: "none",
            fontSize: "16px",
            color: "#000",
          }}
          placeholder="Write your notes here..."
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          onBlur={()=>actions.updateNoteToTopic(noteID,content)}
        />
        {console.log("note ID: ",noteID)}
      </div>
    </div>
  );
};

export default Notebook;
