import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext.js";


export const EditClassPage = () => {
  const { store, actions } = useContext(Context);
  const [resourceLink, setResourceLink] = useState("");
  const inputModule = useRef(null);
  const inputResource = useRef(null);
  const params = useParams();

  useEffect(() => {
    actions.getCourseByID(params.courseId);
  }, []);

  return (
    <div className="container-fluid p-0 " style={{ height: "90vh" }}>
      {console.log("selectedCourse: ", store?.selectedCourse)}
      <div class="row h-100">
        <div class="col-3 h-100  d-flex flex-column justify-content-end">
          <EditableAccordion
            modules={store?.selectedCourse?.modules || []}
            onTopicSelect={setResourceLink}
            getResource={getResource}
          />
          {/* Add and Delete Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-auto">
            <input type="text" ref={inputModule} />
            <button
              className="btn btn-primary"
              onClick={() => actions.createModule(params.courseId, inputModule.current.value.toString())}
            >
              Add Module
            </button>
          </div>
        </div>
        <div class="col-6">
          <div className="edit-resource text-center">
            <input className="m-4 w-75" type="text" defaultValue={resourceLink} ref={inputResource} />
            <button
              className="btn btn-primary"
              onClick={() => {

                const inpute = inputResource.current?.value.trim(); // Safely access value and trim it

                if (inpute && !resourceLink) {
                  console.log("url input", inpute);
                  setResourceLink(inpute);
                  actions.createResource(inpute, store.selectedTopic.id);
                }
                else if (inpute && resourceLink) {
                  console.log("url input", inpute);
                  setResourceLink(inpute);
                  actions.updateResource(inpute, store.selectedTopic.id);
                }
                else {
                  console.error('Resource Input is empty'); // Optional error handling
                }
              }}
            >
              Set Resource
            </button>
          </div>
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
        </div>
      </div>
    </div>
  );
};

const getEmbedLink = (url) => {
  console.log("url before getEmbedLink", url);

  try {
    const urlObj = new URL(url);

    // ✅ If already an embed URL, return it as is
    if (urlObj.hostname === "www.youtube.com" && urlObj.pathname.startsWith("/embed/")) {
      return url;
    }

    // ✅ If it's a shortened youtu.be link
    if (urlObj.hostname === "youtu.be") {
      const videoId = urlObj.pathname.slice(1); // Extract video ID from path
      const playlist = urlObj.searchParams.get("list");
      return playlist
        ? `https://www.youtube.com/embed/${videoId}?list=${playlist}`
        : `https://www.youtube.com/embed/${videoId}`;
    }

    // ✅ If it's a standard YouTube watch link
    if (urlObj.hostname === "www.youtube.com" || urlObj.hostname === "youtube.com") {
      const videoId = urlObj.searchParams.get("v");
      const playlist = urlObj.searchParams.get("list");

      if (!videoId) {
        alert(`URL is not valid! \n ${url}`);
        return null;
      }

      console.log("url id after getEmbedLink", videoId);
      return playlist
        ? `https://www.youtube.com/embed/${videoId}?list=${playlist}`
        : `https://www.youtube.com/embed/${videoId}`;
    }

    return url; // Return as-is for non-YouTube links

  } catch (error) {
    alert(`URL is not valid! \n ${url}`);
    return null;
  }
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
    console.log("urls:", urls);
    return urls;
  } catch (error) {
    console.log("Error fetching resource from backend:", error);
    return null;
  }
};



const EditableAccordion = ({ modules = [], onTopicSelect, getResource }) => {
  const { store, actions } = useContext(Context);
  const inputRefs = useRef({}); // Dynamic refs object to store refs for each module

  const handleClick = async (id) => {
    try {
      const data = await getResource(id);

      if (Array.isArray(data) && data.length > 0) {
        console.log("url       ", data[0]);
        onTopicSelect(data[0]); // Access the first value in the array
      } else {
        onTopicSelect(data);
      }

      // Scroll to the top of the current page
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error in handleClick:", error);
    }
  };

  const handleAddTopic = (moduleId) => {
    const inputRef = inputRefs.current[moduleId]; // Access the correct ref for the module
    const inputValue = inputRef?.value.trim(); // Safely get and trim the value

    if (inputValue) {
      actions.createTopic(moduleId, inputValue); // Add topic
      inputRef.value = ""; // Clear the input
    } else {
      console.error("Input is empty");
    }
  };

  return (
    <div
      className="accordion accordion-flush overflow-auto mh-100"
      id="accordionFlushExample"
    >
      {/* Handle the case where modules is empty */}
      {(!modules || modules.length === 0) && (
        <p className="text-center mt-3">No modules available</p>
      )}

      {modules.map((module, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header d-flex" id={`flush-heading${index}`}>
            <button
              className="accordion-button collapsed d-flex align-items-center"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#flush-collapse${index}`}
              aria-expanded="false"
              aria-controls={`flush-collapse${index}`}
            >
              <UpdateModule module={module} />
              <a
                className="deleteBTN"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  actions.deleteModule(module.id);
                }}
                style={{
                  cursor: "pointer",
                  color: "red",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-x-lg"
                  style={{
                    cursor: "pointer",
                    color: "red",
                    marginLeft: "auto",
                  }}
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </a>
            </button>
          </h2>
          <div
            id={`flush-collapse${index}`}
            className="accordion-collapse collapse"
            aria-labelledby={`flush-heading${index}`}
            data-bs-parent="#accordionFlushExample"
          >
            {module.topics?.map((topic, i) => (
              <div
                key={i}
                to="#"
                className="text-decoration-none"
                onClick={() => {
                  handleClick(topic.id);
                  actions.setCustomStore({ selectedTopic: topic });
                }}
              >
                <div className="accordion-body dropdown-item d-flex justify-content-between">
                  <UpdateTopic topic={topic} />
                  <a
                    className="deleteBTN"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      actions.deleteTopic(module.id, topic.id);
                    }}
                    style={{
                      cursor: "pointer",
                      color: "red",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-x-lg"
                      style={{
                        cursor: "pointer",
                        color: "red",
                        marginLeft: "auto",
                      }}
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                  </a>
                  <div >
                    <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="blue" class="bi bi-link-45deg" viewBox="0 0 16 16">
                      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                    </svg>
                  </div>
                  

                </div>
              </div>
            ))}
            <input
              type="text"
              ref={(el) => (inputRefs.current[module.id] = el)} // Dynamically assign refs
            />
            <button
              className="btn btn-primary"
              onClick={() => handleAddTopic(module.id)} // Pass module id
            >
              Add Topic
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditableAccordion;

const UpdateModule = ({ module }) => {
  const [moduleName, setModuleName] = useState(module.name);
  const { actions } = useContext(Context);
  const handleChange = (event) => {
    setModuleName(event.target.value);
  };

  return (<>
    <input
      type="text"
      value={moduleName}
      onChange={handleChange}
      onBlur={() => { actions.updateModule(module.id, moduleName) }} // Trigger PUT request when input loses focus
      style={{
        all: "unset",// Removes all inherited and default styles
        cursor: "text",
        width: "85%",
      }}
    /> </>
  );
};

const UpdateTopic = ({ topic }) => {
  const [topicName, setTopicName] = useState(topic.name);
  const { actions } = useContext(Context);
  const handleChange = (event) => {
    setTopicName(event.target.value);
  };

  return (
    <input
      type="text"
      value={topicName}
      onChange={handleChange}
      onBlur={() => { actions.updateTopic(topic.id, topicName) }} // Trigger PUT request when input loses focus
      style={{
        all: "unset",// Removes all inherited and default styles
        cursor: "text",
        width: "88%",
      }}
    />

  );
};