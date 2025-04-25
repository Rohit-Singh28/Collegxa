"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/counsellor/login");
    }
  }, []);
  return <div>Dashboard</div>;
};

export default page;
