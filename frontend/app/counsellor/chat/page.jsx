"use client";
import { useContext, useEffect, useState, useRef } from "react";
import {
  initiateSocket,
  sendMessage,
  subscribeToMessages,
  disconnectSocket,
} from "../../../utils/socket";
import axios from "axios";
import { counsellorContext } from "@/app/_context/counsellorContext";

export default function CounselorChat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const chatContainerRef = useRef(null);
  const { counsellor } = useContext(counsellorContext);
  const counselorId = counsellor?.id;

  // Define user type constants
  const userType = "COUNSELLOR";
  const recipientType = "STUDENT";

  // Initialize socket when counselorId is available
  useEffect(() => {
    if (counselorId) {
      initiateSocket(counselorId, userType);

      subscribeToMessages((data) => {
        const studentId = data.from;
        const message = data.message;

        // Check if this student exists in our list using strict comparison
        setStudents((prevStudents) => {
          // Check if student already exists
          const existingStudentIndex = prevStudents.findIndex(
            (s) => s.id === parseInt(studentId)
          );

          if (existingStudentIndex !== -1) {
            // Student exists, update their last message
            const updatedStudents = [...prevStudents];
            updatedStudents[existingStudentIndex] = {
              ...updatedStudents[existingStudentIndex],
              lastMessage: message,
            };
            return updatedStudents;
          } else {
            // Add new student
            return [
              ...prevStudents,
              {
                id: parseInt(studentId),
                name: `Student ${studentId}`,
                lastMessage: message,
              },
            ];
          }
        });

        // If this message is from the currently selected student, add to chat log
        if (selectedStudent && selectedStudent.id === parseInt(studentId)) {
          setChatLog((prev) => [
            ...prev,
            {
              from: data.from,
              fromType: data.fromType || recipientType,
              message: data.message,
            },
          ]);
        }
      });

      // Load saved students from localStorage
      const savedStudents = localStorage.getItem(
        `counselor_${counselorId}_students`
      );
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      }

      // Cleanup on component unmount
      return () => {
        disconnectSocket();
      };
    }
  }, [counselorId, selectedStudent]);

  // Save students to localStorage when they change
  useEffect(() => {
    if (counselorId && students.length > 0) {
      localStorage.setItem(
        `counselor_${counselorId}_students`,
        JSON.stringify(students)
      );
    }
  }, [students, counselorId]);

  // Fetch chat history when selecting a student
  useEffect(() => {
    if (selectedStudent) {
      fetchHistory(selectedStudent.id);
    }
  }, [selectedStudent]);

  // Scroll to bottom when chat log updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  const fetchHistory = async (studentId) => {
    if (!counselorId || !studentId) {
      console.error("Missing counselorId or studentId for fetching history");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4040"
        }/api/chats`,
        {
          params: {
            counselorId: counselorId,
            studentId: studentId,
          },
          withCredentials: true,
        }
      );

      setChatLog(
        res.data.map((chat) => ({
          from: chat.studentSenderId
            ? chat.studentSenderId.toString()
            : chat.counsellorSenderId.toString(),
          fromType: chat.senderType,
          message: chat.message,
        }))
      );
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!selectedStudent) {
      return;
    }

    if (!message.trim() || !counselorId) {
      return;
    }

    sendMessage(selectedStudent.id.toString(), recipientType, message);

    // Add message to chat log
    setChatLog((prev) => [
      ...prev,
      {
        from: counselorId.toString(),
        fromType: userType,
        message,
      },
    ]);

    // Update last message for this student
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, lastMessage: message }
          : student
      )
    );

    setMessage("");
  };

  // Handle Enter key in message input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Filter students based on search input
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Format timestamp for messages
  const getTimeString = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar - Students list */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Student Chats</h2>
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Counselor
            </div>
          </div>

          {/* Search students */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full p-2 pl-8 rounded-lg border"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
            />
            <div className="absolute left-2 top-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Students list */}
        <div className="flex-1 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No students have messaged you yet
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedStudent?.id === student.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                    {student.name.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-xs text-gray-500">{getTimeString()}</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {student.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right chat area */}
      <div className="w-2/3 flex flex-col">
        {selectedStudent ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{selectedStudent.name}</p>
                  <p className="text-xs text-gray-500">
                    ID: {selectedStudent.id}
                  </p>
                </div>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="text-gray-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                </svg>
              </div>
            </div>

            {/* Chat messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-100"
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : chatLog.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatLog.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg max-w-[70%] ${
                        chat.fromType === userType ||
                        chat.from === counselorId?.toString()
                          ? "bg-blue-100 ml-auto"
                          : "bg-white"
                      }`}
                    >
                      <p>{chat.message}</p>
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {chat.fromType === userType ||
                        chat.from === counselorId?.toString()
                          ? "You"
                          : `Student ${chat.from}`}
                        <span className="ml-2">{getTimeString()}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-4 bg-white border-t flex items-center">
              <div className="flex-1 flex border rounded-lg overflow-hidden">
                <input
                  className="flex-1 p-3 focus:outline-none"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="bg-blue-500 text-white p-3 px-6"
                  onClick={handleSend}
                  disabled={!message.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="text-blue-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">
                Welcome, Counselor!
              </h3>
              <p className="text-gray-500 mt-2">
                Select a student from the list to start chatting.
              </p>
              <p className="text-gray-500 mt-2">
                New student messages will appear in the sidebar automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
