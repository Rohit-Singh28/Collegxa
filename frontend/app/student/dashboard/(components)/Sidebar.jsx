"use client";

import { useState } from "react";

export default function Sidebar({ activeSection, setActiveSection }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    "Chats",
    "Sessions",
    "Student Info",
    "Suggested Counsellor",
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Counsellor Dashboard</h1>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded hover:bg-gray-100"
        >
          <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-600"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveSection(item);
                  setIsMobileMenuOpen(false);
                }}
                className={`p-4 text-left ${
                  activeSection === item
                    ? "bg-[#8200DB] text-white"
                    : "hover:bg-purple-100"
                }`}
              >
                <span className="ml-8">{item}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed w-64 h-screen bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl">Counsellor Dashboard</h1>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveSection(item)}
              className={`flex items-center p-3 rounded-md transition-colors ${
                activeSection === item
                  ? "bg-[#8200DB] text-white"
                  : "hover:bg-purple-100"
              }`}
            >
              <div className="w-6 h-6 mr-3">{/* Space for future icons */}</div>
              <span>{item}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
