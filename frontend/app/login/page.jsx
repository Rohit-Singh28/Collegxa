"use client";

import { useRouter } from "next/navigation";
import { UserCircle, GraduationCap, BookOpen } from "lucide-react";
import Header from "../(components)/header/Header";

export default function LoginTypePage() {
  const router = useRouter();

  const handleRedirect = (path) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-white via-[#f1f5f9] to-[#e0f2fe]">
        <div className="w-full max-w-5xl">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6] mb-3 text-center">
            Welcome to Collexga
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto text-lg">
            Select your user type to proceed to the appropriate login page.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Login Option */}
            <div
              onClick={() => handleRedirect("/student/login")}
              className="bg-white rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-2xl border border-gray-100 hover:border-blue-500"
            >
              <div className="bg-gradient-to-br from-blue-100 to-teal-100 p-5 rounded-full mb-6">
                <UserCircle className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Student</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Access your dashboard, sessions, grades, and progress tracking.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 px-8 rounded-md font-medium hover:from-blue-700 hover:to-teal-600 transition-all w-full max-w-xs shadow-md hover:shadow-lg">
                Student Login
              </button>
            </div>

            {/* Counselor Login Option */}
            <div
              onClick={() => handleRedirect("/counsellor/login")}
              className="bg-white rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-2xl border border-gray-100 hover:border-purple-500"
            >
              <div className="bg-gradient-to-br from-purple-100 to-violet-100 p-5 rounded-full mb-6">
                <GraduationCap className="w-16 h-16 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Counsellor
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                Manage student sessions, provide guidance, and track
                performance.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-8 rounded-md font-medium hover:from-purple-700 hover:to-pink-600 transition-all w-full max-w-xs shadow-md hover:shadow-lg">
                Counsellor Login
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
