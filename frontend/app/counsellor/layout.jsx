"use client";
import React, { useEffect, useState } from "react";
import { counsellorContext } from "../_context/counsellorContext";
import axios from "axios";
import Header from "./(components)/header";

const layout = ({ children }) => {
  const [counsellor, setCounsellor] = useState({
    email: "",
  });

  const fetchStudentInfo = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/counsellor/info`,
        {
          withCredentials: true, // This is critical for cookies to work
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setCounsellor(res.data.data);
        // console.log(res.data.data); // Log the student data to the console
      } // Log the student data to the console
    } catch (error) {
      console.error("Error fetching Counsellor info:", error);
    }
  };

  // console.log("Counsellor info:", counsellor); // Log the student data to the console

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  return (
    <div>
      <counsellorContext.Provider value={{ counsellor, setCounsellor }}>
        <Header />
        {children}
      </counsellorContext.Provider>
    </div>
  );
};

export default layout;
