"use client";
import React from "react";
import Header from "../(components)/Header";

const layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default layout;
