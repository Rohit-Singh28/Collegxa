import React from "react";
import { Search, LogOut } from "lucide-react";

const Header = () => {
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
          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            Dashboard
          </a>

          <a
            href="#"
            className="text-gray-700 hover:text-purple-600 font-medium"
          >
            About
          </a>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search college name"
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {/* Logout Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Header;
