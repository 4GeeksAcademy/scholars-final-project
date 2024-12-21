import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import AccordionMenu from "../component/AccordionMenu.js";

export const ClassPage = () => {
  const { store, actions } = useContext(Context);

  return (
    <div style={{ margin: "20px" }}>
      <AccordionMenu />
    </div>
  );
};
