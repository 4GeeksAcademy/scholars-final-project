import React, { useState } from "react";
import { Link } from "react-router-dom";

const AccordionMenu = ({ modules, onTopicSelect }) => {
  const handleClick = (resource) => {
    onTopicSelect(resource);
    // Scroll to the top of the current page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="accordion accordion-flush overflow-auto mh-100"
      id="accordionFlushExample"
    >
      {console.log(modules[0])}
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
              {item.moduleName}
            </button>
          </h2>
          <div
            id={`flush-collapse${index}`}
            className="accordion-collapse collapse"
            aria-labelledby={`flush-heading${index}`}
            data-bs-parent="#accordionFlushExample"
          >
            {item.topics.map((topic, i) => (
              <Link
                key={i}
                to="#"
                className="text-decoration-none"
                onClick={() => handleClick(topic.resource)}
              >
                <div className="accordion-body dropdown-item cursor-pointer">
                  {topic.topic}
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
