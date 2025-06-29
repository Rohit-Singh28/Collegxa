"use client";
import { counsellorContext } from "@/app/_context/counsellorContext";
import axios from "axios";
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const Header = () => {
  const { counsellor } = useContext(counsellorContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const route = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/counsellor/logout`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        setIsLoggedIn(false);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogin = () => {
    window.location.href = "/student/login";
  };

  useEffect(() => {
    if (counsellor?.email != "" && Object.keys(counsellor).length > 0) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [counsellor]);

  return (
    <nav className="bg-white shadow-md py-4 px-6 md:px-10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="h-10 w-10 bg-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">SC</span>
          </div>
          <span className="ml-2 text-xl font-semibold text-gray-800">
            StudentCounsel
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Home
          </a>
          {isLoggedIn && (
            <a
              href="/student/dashboard"
              className="text-gray-700 hover:text-purple-600 font-medium"
            >
              Dashboard
            </a>
          )}
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            About
          </a>
        </div>

        {/* Conditional Login/Logout Button */}
        {isLoggedIn ? (
          <button
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
            onClick={handleLogin}
          >
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
