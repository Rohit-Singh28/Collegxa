"use client";
import { useContext, useEffect, useState, useRef } from "react";
import {
  initiateSocket,
  sendMessage,
  subscribeToMessages,
  disconnectSocket,
} from "../../../../../utils/socket";
import axios from "axios";
import { counsellorContext } from "@/app/_context/counsellorContext";
import { Plus, Search, Settings } from "lucide-react";

export default function CounselorChat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
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

        // Check if message is from current selected student
        if (selectedStudent && selectedStudent.id === parseInt(studentId)) {
          setChatLog((prev) => [
            ...prev,
            {
              from: data.from,
              fromType: data.fromType || recipientType,
              message: data.message,
              timestamp: new Date(),
            },
          ]);
          // If not at bottom of chat, mark as unread
          if (!isAtBottom) {
            setUnreadMessages((prev) => ({
              ...prev,
              [studentId]: (prev[studentId] || 0) + 1,
            }));
          }
        } else {
          // Update unread count for non-selected students
          setUnreadMessages((prev) => ({
            ...prev,
            [studentId]: (prev[studentId] || 0) + 1,
          }));
        }

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
              lastMessageTime: new Date(),
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
                lastMessageTime: new Date(),
              },
            ];
          }
        });
      });

      // Load saved students from localStorage
      try {
        const savedStudents = localStorage.getItem(
          `counselor_${counselorId}_students`
        );
        if (savedStudents) {
          setStudents(JSON.parse(savedStudents));
        }

        // Load unread messages from localStorage
        const savedUnreadMessages = localStorage.getItem(
          `counselor_${counselorId}_unread_messages`
        );
        if (savedUnreadMessages) {
          setUnreadMessages(JSON.parse(savedUnreadMessages));
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }

      // Cleanup on component unmount
      return () => {
        disconnectSocket();
      };
    }
  }, [counselorId]);

  // Save students to localStorage when they change
  useEffect(() => {
    if (counselorId && students.length > 0) {
      try {
        localStorage.setItem(
          `counselor_${counselorId}_students`,
          JSON.stringify(students)
        );
      } catch (error) {
        console.error("Error saving students:", error);
      }
    }
  }, [students, counselorId]);

  // Save unread messages to localStorage
  useEffect(() => {
    if (counselorId) {
      try {
        localStorage.setItem(
          `counselor_${counselorId}_unread_messages`,
          JSON.stringify(unreadMessages)
        );
      } catch (error) {
        console.error("Error saving unread messages:", error);
      }
    }
  }, [unreadMessages, counselorId]);

  // Fetch chat history when selecting a student
  useEffect(() => {
    if (selectedStudent) {
      fetchHistory(selectedStudent.id);
      // Reset unread counter when selecting a student
      setUnreadMessages((prev) => ({
        ...prev,
        [selectedStudent.id]: 0,
      }));
      // Focus on message input
      setTimeout(() => {
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      }, 100);
      // On mobile, auto-hide sidebar when a chat is selected
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    }
  }, [selectedStudent]);

  // Handle scroll events for chat container
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const bottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 20;
      setIsAtBottom(bottom);

      // If scrolled to bottom, clear unread messages for this student
      if (bottom && selectedStudent) {
        setUnreadMessages((prev) => ({
          ...prev,
          [selectedStudent.id]: 0,
        }));
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [selectedStudent]);

  // Scroll to bottom when chat log updates
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatLog, isAtBottom]);

  // Check for window resize to handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          timestamp: new Date(chat.createdAt || Date.now()),
        }))
      );

      // Scroll to bottom after history is loaded
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
          setIsAtBottom(true);
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });

      // Clear unread messages for this student
      if (selectedStudent) {
        setUnreadMessages((prev) => ({
          ...prev,
          [selectedStudent.id]: 0,
        }));
      }
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
        timestamp: new Date(),
      },
    ]);

    // Update last message for this student
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, lastMessage: message, lastMessageTime: new Date() }
          : student
      )
    );

    setMessage("");

    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100);
  };

  // Handle Enter key in message input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Format timestamp for messages
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return formatTime(new Date());

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return formatTime(date);
  };

  // Format time to HH:MM format
  const formatTime = (date) => {
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Format date to show relative time
  const getRelativeDate = (timestamp) => {
    if (!timestamp) return "Today";

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Sort students by last message time
  const sortedStudents = [...students].sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return timeB - timeA;
  });

  // Filter students based on search input
  const filteredStudents = sortedStudents.filter((student) =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden">
      {/* Left sidebar - Students list */}
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white flex flex-col transition-transform duration-300 ease-in-out absolute md:relative z-20 h-full`}
      >
        {/* Header */}
        <div className="p-3 bg-[#1f2937] text-white flex justify-between items-center">
          <h2 className="text-xl font-medium">Student Chats</h2>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Counselor
            </div>
          </div>
        </div>

        {/* Search students */}
        <div className="p-2 bg-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full p-2 pl-10 rounded-lg border-none bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-500">
              <Search size={16} strokeWidth={1.25} />
            </div>
          </div>
        </div>

        {/* Students list */}
        <div className="flex-1 overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <p className="font-medium">No students yet</p>
              <p className="text-sm mt-1">
                Students will appear when they message you
              </p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 ${
                  selectedStudent?.id === student.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p
                        className={`font-medium truncate ${
                          unreadMessages[student.id]
                            ? "text-blue-600 font-semibold"
                            : ""
                        }`}
                      >
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeDate(student.lastMessageTime)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p
                        className={`text-sm truncate ${
                          unreadMessages[student.id]
                            ? "text-black font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {student.lastMessage || "No messages yet"}
                      </p>
                      <div className="flex items-center">
                        {unreadMessages[student.id] > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-1">
                            {unreadMessages[student.id]}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {student.lastMessageTime
                            ? formatMessageTime(student.lastMessageTime)
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right chat area */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col relative">
        {selectedStudent ? (
          <>
            {/* Chat header */}
            <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center">
                {/* Mobile back button */}
                <button
                  className="md:hidden mr-2 text-gray-600"
                  onClick={toggleSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>

                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-xs text-gray-500">
                    ID: {selectedStudent.id}
                  </p>
                </div>
              </div>
              <div>
                <Settings size={20} className="text-gray-500" />
              </div>
            </div>

            {/* Chat messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto relative z-10 bg-[#f5f5f5]"
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-500 mt-4">Loading messages...</p>
                  </div>
                </div>
              ) : chatLog.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center bg-white p-6 rounded-lg shadow-sm max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Start the conversation
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Send a message to begin counseling with this student
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatLog.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        chat.fromType === userType ||
                        chat.from === counselorId?.toString()
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[75%] shadow-sm ${
                          chat.fromType === userType ||
                          chat.from === counselorId?.toString()
                            ? "bg-blue-500 text-white rounded-tr-none"
                            : "bg-white rounded-tl-none"
                        }`}
                      >
                        <p>{chat.message}</p>
                        <p
                          className={`text-xs ${
                            chat.fromType === userType ||
                            chat.from === counselorId?.toString()
                              ? "text-gray-200"
                              : "text-gray-500"
                          } text-right mt-1`}
                        >
                          {formatMessageTime(chat.timestamp)}
                          {(chat.fromType === userType ||
                            chat.from === counselorId?.toString()) && (
                            <span className="ml-1 text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="inline-block"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                              </svg>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Scroll to bottom button */}
              {!isAtBottom && selectedStudent && (
                <button
                  onClick={scrollToBottom}
                  className="fixed bottom-20 right-4 md:right-6 z-30 bg-blue-500 text-white rounded-full p-3 shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  {unreadMessages[selectedStudent.id] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessages[selectedStudent.id]}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Message input */}
            <div className="p-2 bg-[#f0f2f5] border-t border-gray-200 flex items-center z-10">
              <button className="p-2 text-gray-600 hover:text-gray-800 hidden md:block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </button>
              <div className="flex-1 mx-2">
                <input
                  ref={messageInputRef}
                  className="w-full rounded-full py-2 px-4 border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              {message.trim() ? (
                <button
                  className="p-2 text-blue-500 hover:text-blue-600"
                  onClick={handleSend}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              ) : (
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800">
                Welcome, Counselor!
              </h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Select a student from the sidebar to start your counseling
                session
              </p>
              <p className="text-gray-500 mt-2">
                New student messages will appear in the sidebar automatically
              </p>
              {/* Mobile view - show sidebar button */}
              <button
                onClick={toggleSidebar}
                className="mt-6 bg-blue-500 text-white px-5 py-2 rounded-full md:hidden flex items-center mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
                View Students
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
