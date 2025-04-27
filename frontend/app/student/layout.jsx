"use client";
import React, { useEffect, useState } from "react";
import Footer from "./(components)/Footer";
import Header from "./(components)/Header";
import { studentContext } from "../_context/studentContext";
import axios from "axios";

const layout = ({ children }) => {
  const [student, setStudent] = useState({
    email: "",
    id: "",
  });

  // console.log(student);

  const fetchStudentInfo = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/info`,
        {
          withCredentials: true, // This is critical for cookies to work
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setStudent(res.data.data);
        // console.log(res.data.data); // Log the student data to the console
      } // Log the student data to the console
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  };

  useEffect(() => {
    fetchStudentInfo();
  }, []);

  return (
    <div>
      <studentContext.Provider value={{ student, setStudent }}>
        <Header />
        {children}
        <div>
          <Footer />
        </div>
      </studentContext.Provider>
    </div>
  );
};

export default layout;
