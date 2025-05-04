"use client";

import { useState } from "react";
import Sidebar from "./(components)/Sidebar";
import Chat from "./(components)/ChatsSection";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("Chats");

  const renderContent = () => {
    switch (activeSection) {
      case "Chats":
        return <Chat />;
      //   case "Sessions":
      //     return <SessionsSection />;
      //   case "Student Info":
      //     return <StudentInfoSection />;
      //   case "Suggested Counsellor":
      //     return <SuggestedCounsellorSection />;
      //   default:
      //     return <ChatsSection />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row  h-[calc(100vh-75px)] ">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="flex-1 md:p-6 md:ml-64 h-full ">{renderContent()}</main>
    </div>
  );
}
