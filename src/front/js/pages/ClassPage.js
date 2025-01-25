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
    actions.getCourseByID(params.courseId);
  }, []);

  return (
    <div className="container-fluid p-0" style={{ height: "90vh" }}>
      {console.log("selectedCourse: ", store?.selectedCourse)}
      <div className="row h-100">
        <div className="col-3 h-100">
          <AccordionMenu
            modules={store?.selectedCourse?.modules || []}
            onTopicSelect={setResourceLink}
            getResource={getResource}
          />
        </div>
        <div className="col-6">
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

const getEmbedLink = (url) => {
  console.log("topic IDDIDDDDD", url)
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

const getResource = async (topicID) => {
  try {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
      throw new Error("User is not authenticated. Please log in.");
    }
    const resp = await fetch(`${process.env.BACKEND_URL}/api/resources/by_topic/${topicID}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!resp.ok) {
      throw new Error(`Failed to fetch resource: ${resp.statusText}`);
    }
    const resourceData = await resp.json(); // Parse JSON response 
    // Extract URLs if resourceData is an array
    const urls = resourceData.map(resource => resource.url); // Convert to comma-separated string 
    return urls;
  } catch (error) {
    console.log("Error fetching resource from backend:", error);
    return null;
  }
};