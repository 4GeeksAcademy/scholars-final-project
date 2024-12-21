import React, { useState } from "react";

const AccordionMenu = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const menuItems = [
    {
      title: "Menu 1",
      content: "Content for Menu 1",
    },
    {
      title: "Menu 2",
      content: "Content for Menu 2",
    },
    {
      title: "Menu 3",
      content: "Content for Menu 3",
    },
  ];

  return (
    <div style={styles.accordion}>
      {menuItems.map((item, index) => (
        <div key={index} style={styles.section}>
          <div style={styles.title} onClick={() => toggleSection(index)}>
            {item.title}
          </div>
          {activeIndex === index && (
            <div style={styles.content}>{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  accordion: {
    width: "300px",
    border: "1px solid #ccc",
  },
  section: {
    borderBottom: "1px solid #ccc",
  },
  title: {
    padding: "10px",
    cursor: "pointer",
    background: "#f7f7f7",
  },
  content: {
    padding: "10px",
    background: "#fff",
  },
};

export default AccordionMenu;
