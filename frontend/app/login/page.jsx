"use client";

import { useRouter } from "next/navigation";
import { UserCircle, GraduationCap, BookOpen } from "lucide-react";

export default function LoginTypePage() {
  const router = useRouter();

  const handleRedirect = (path) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#FFFFFF] text-[#38393a] py-4 shadow-lg border-b border-gray-200 ">
        <div className="container mx-auto px-6 flex items-center justify-between ">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold">Education Portal</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="#"
              className="hover:text-gray-200 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="hover:text-gray-200 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="hover:text-gray-200 transition-colors font-medium"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-bold text-[#8112D2] mb-2 text-center">
            Welcome to the Education Portal
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Please select your user type to continue to the appropriate login
            page
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Login Option */}
            <div
              onClick={() => handleRedirect("/student/login")}
              className="bg-white rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-xl border border-gray-100 hover:border-[#8112D2]"
            >
              <div className="bg-[#8112D2]/10 p-5 rounded-full mb-6">
                <UserCircle className="w-16 h-16 text-[#8112D2]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Student</h3>
              <p className="text-gray-600 mb-8">
                Access your courses, assignments, grades, and track your
                academic progress
              </p>
              <button className="bg-[#8112D2] text-white py-3 px-8 rounded-md font-medium hover:bg-[#6a0eb0] transition-colors w-full max-w-xs shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                <span>Student Login</span>
              </button>
            </div>

            {/* Counselor Login Option */}
            <div
              onClick={() => handleRedirect("/counsellor/login")}
              className="bg-white rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-xl border border-gray-100 hover:border-[#8112D2]"
            >
              <div className="bg-[#8112D2]/10 p-5 rounded-full mb-6">
                <GraduationCap className="w-16 h-16 text-[#8112D2]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Counsellor
              </h3>
              <p className="text-gray-600 mb-8">
                Manage students, schedule sessions, provide guidance and access
                academic records
              </p>
              <button className="bg-[#8112D2] text-white py-3 px-8 rounded-md font-medium hover:bg-[#6a0eb0] transition-colors w-full max-w-xs shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                <span>Counsellor Login</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-[#8112D2]" />
                <span className="font-bold text-lg">Education Portal</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Empowering education through technology
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Support
              </a>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-700 pt-4 text-center md:text-left text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Education Portal. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
