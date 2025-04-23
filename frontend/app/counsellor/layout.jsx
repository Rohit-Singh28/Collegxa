"use client";
import React, { useState } from "react";
import { counsellorContext } from "../_context/counsellorContext";

const layout = ({ children }) => {
  const [counsellor, setCounsellor] = useState({
    email: "rohitsingh450718@gmail.com",
  });
  return (
    <div>
      <counsellorContext.Provider value={{ counsellor, setCounsellor }}>
        {children}
      </counsellorContext.Provider>
    </div>
  );
};

export default layout;
