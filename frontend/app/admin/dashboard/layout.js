"use client";

import { useState } from "react";
import Sidebar from "../(components)/Sidebar";
import CounsellorVerification from "../(components)/CounsellorVerification";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("Chats");

  const renderContent = () => {
    switch (activeSection) {
      case "counsellor verification":
        return <CounsellorVerification />;
      case "Feedback":
      // return <CounselorFeedbackForm />;
      //   case "Student Info":
      //     return <StudentInfoSection />;
      case "Suggested Counsellor":
      // return <MeetCounsellor />;
      //   default:
      //     return <ChatsSection />;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row  min-h-[calc(100vh-80px)] ">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main className="flex-1 md:p-6 md:ml-64 min-h-full bg-[#F2F7FD]">
          {renderContent()}
        </main>
      </div>
    </>
  );
}
