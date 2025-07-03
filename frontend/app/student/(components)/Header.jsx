import React, { useContext, useState, useEffect } from "react";
import { Search, LogOut, LogIn, Menu, X } from "lucide-react";
import CollegeAutocomplete from "@/app/search/(components)/collegeAutocomplete";
import { studentContext } from "@/app/_context/studentContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import logo from "../../../public/header/logo.png";
import Image from "next/image";

const Header = () => {
  const [selectedCollege, setSelectedCollege] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const { student } = useContext(studentContext);

  const handleSearch = async () => {
    if (!selectedCollege?.name) {
      alert("Please select a college to search.");
      return;
    }

    setIsSearching(true);
    try {
      const collegeId = encodeURIComponent(selectedCollege.name);
      await router.push(`/student/${collegeId}`);
    } catch (error) {
      console.error("Navigation error:", error);
      alert("Failed to navigate to college page. Please try again.");
    } finally {
      setIsSearching(false);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const hasValidStudent = student?.email && Object.keys(student).length > 0;
    setIsLoggedIn(hasValidStudent);
  }, [student]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/logout`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setIsLoggedIn(false);
        window.location.href = "/login";
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const handleLogin = () => {
    window.location.href = "/student/login";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { label: "Home", href: "/", showAlways: true },
    {
      label: "Dashboard",
      href: "/student/dashboard",
      showAlways: false,
      requiresAuth: true,
    },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 py-1.5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link href={"/"}>
              <Image src={logo} alt="Collegxa Logo" className="h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const shouldShow =
                item.showAlways || (item.requiresAuth && isLoggedIn);
              return shouldShow ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-green-50"
                >
                  {item.label}
                </a>
              ) : null;
            })}
          </div>

          {/* Search Section */}
          <div className="hidden md:flex items-center space-x-3 flex-1 max-w-md mx-8">
            <div className="flex-1">
              <CollegeAutocomplete onSelectCollege={setSelectedCollege} />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !selectedCollege?.name}
              className="flex items-center gap-2 px-4 py-2 bg-[#00A998] text-white font-medium rounded-lg hover:bg-[#00A998 ] focus:outline-none focus:ring-2 focus:ring-[#00A998] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isSearching ? "Searching..." : "Search"}
              </span>
            </button>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A998] text-white font-medium rounded-lg hover:bg-[#00A998] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:[#00A998] hover:bg-[#d9e9e7] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              {navigationItems.map((item) => {
                const shouldShow =
                  item.showAlways || (item.requiresAuth && isLoggedIn);
                return shouldShow ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 block px-3 py-2 rounded-md font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : null;
              })}

              {/* Mobile Search */}
              <div className="pt-2 pb-3 border-t border-gray-200">
                <div className="space-y-3">
                  <CollegeAutocomplete onSelectCollege={setSelectedCollege} />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching || !selectedCollege?.name}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00A998] text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search className="h-4 w-4" />
                    <span>
                      {isSearching ? "Searching..." : "Search Colleges"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Mobile Auth Button */}
              <div className="pt-2 border-t border-gray-200">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
