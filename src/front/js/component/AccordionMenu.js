import React from "react";
import { Link } from "react-router-dom";

const AccordionMenu = ({ modules = [], onTopicSelect, getResource }) => {
  const handleClick = async (id) => {
    try {
      const data = await getResource(id);
      
      if (Array.isArray(data) && data.length > 0) {
        onTopicSelect( data[0]); // Access the first value in the array
      } else {
        onTopicSelect( data);
      } 

      // Scroll to the top of the current page
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error in handleClick:", error);
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

      {modules.map((item, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header" id={`flush-heading${index}`}>
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#flush-collapse${index}`}
              aria-expanded="false"
              aria-controls={`flush-collapse${index}`}
            >
              {item.name}
            </button>
          </h2>
          <div
            id={`flush-collapse${index}`}
            className="accordion-collapse collapse"
            aria-labelledby={`flush-heading${index}`}
            data-bs-parent="#accordionFlushExample"
          >
            {item.topics?.map((topic, i) => (
              <Link
                key={i}
                to="#"
                className="text-decoration-none"
                onClick={() => handleClick(topic.id)}
              >
                <div className="accordion-body dropdown-item cursor-pointer">
                  {topic.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccordionMenu;
 