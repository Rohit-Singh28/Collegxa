"use client";
import { counsellorContext } from "@/app/_context/counsellorContext";
import React, { useContext } from "react";
import RegisterPage from "../(components)/BasicInfo";

const register = () => {
  const { counsellor } = useContext(counsellorContext);
  console.log(counsellor);

  return (
    <div>
      <h1>Register</h1>
      <p>Welcome to the registration page!</p>
      <RegisterPage />
    </div>
  );
};

export default register;
