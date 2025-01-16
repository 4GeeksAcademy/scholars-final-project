import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext.js";
import AccordionMenu from "../component/AccordionMenu.js";
import PopupChat from "../component/PopupChat.jsx";
import Notebook from "../component/Notebook.jsx";


export const ClassPage = () => {
  const { store, actions } = useContext(Context);
  const [resourceLink, setResourceLink] = useState("");
  const params = useParams();

  useEffect(() => {
    actions.getAllCourses();
  }, []);

  const getEmbedLink = (url) => {
    const urlObj = new URL(url);

    if (urlObj.hostname === "youtu.be") {
      const videoId = urlObj.pathname.slice(1); // Extract video ID from path
      const playlist = urlObj.searchParams.get("list");
      return playlist
        ? `https://www.youtube.com/embed/${videoId}?list=${playlist}`
        : `https://www.youtube.com/embed/${videoId}`;
    }

    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      const videoId = urlObj.searchParams.get("v");
      const playlist = urlObj.searchParams.get("list");
      return playlist
        ? `https://www.youtube.com/embed/${videoId}?list=${playlist}`
        : `https://www.youtube.com/embed/${videoId}`;
    }

    return url; // Return as-is for non-YouTube links
  };

  return (
    <div className="container-fluid p-0" style={{ height: "90vh" }}>
      {console.log("findCourse: ", findCourse(store.AllCourses, params.courseId))}
      <div class="row h-100">
        <div class="col-3 h-100">
          <AccordionMenu
            modules={findCourse(store.AllCourses, params.courseId)?.modules}
            onTopicSelect={setResourceLink}
          />
        </div>
        <div class="col-6">
          <div style={{ padding: "1em" }}>
            {resourceLink ? (
              <div style={{ textAlign: "center" }}>
                <iframe
                  width="100%"
                  height="500"
                  src={getEmbedLink(resourceLink)}
                  title="YouTube video player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; "
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div style={{ textAlign: "center", marginTop: "2em" }}>
                <h3>Select a topic to view the video</h3>
              </div>
            )}
          </div>
          <Notebook />
        </div>
        <div class="col-3">
          <PopupChat />
        </div>
      </div>
    </div>
  );
};

const findCourse = (AllCourse, ID) => {
  for (const course of AllCourse) {
    console.log("course id", course.id);
    console.log("id:", parseInt(ID, 10));
    if (course.id == parseInt(ID, 10)) {
      console.log("course id", course.id);
      return course;
    }
  }
  return null;
};

