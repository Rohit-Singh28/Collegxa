import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import logo from "../../../public/header/logo.png";
import Image from "next/image";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 lg:py-2 bg-opacity-80 backdrop-blur-md border-b-[1px] border-b-black rounded-b-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={"/"}>
              <Image src={logo} alt="Collegxa Logo" className="h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link href={"/login"}>
                <button className=" bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Login
                </button>
              </Link>
              <Link href={"/login"}>
                <button className=" bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black bg-opacity-90 rounded-b-lg">
              <button className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white hover:bg-opacity-10">
                Login
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
