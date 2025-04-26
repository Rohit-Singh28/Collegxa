"use client";
import React, { useState } from "react";
import { counsellorContext } from "../_context/counsellorContext";

const layout = ({ children }) => {
  const [counsellor, setCounsellor] = useState({
    email: "",
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
