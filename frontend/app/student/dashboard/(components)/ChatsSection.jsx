"use client";

import { useContext, useEffect, useState, useRef } from "react";
import {
  initiateSocket,
  sendMessage,
  subscribeToMessages,
  disconnectSocket,
} from "../../../../utils/socket";
import axios from "axios";
import { studentContext } from "@/app/_context/studentContext";
import { Plus, Search } from "lucide-react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [counselorId, setCounselorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchCounselor, setSearchCounselor] = useState("");
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showAddCounselor, setShowAddCounselor] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const { student } = useContext(studentContext);
  const userId = student?.id;

  // Since this is a student component, we know the user type
  const userType = "STUDENT";
  const recipientType = "COUNSELLOR";

  console.log(userId, "userId from context");

  // Initialize socket when userId is available
  useEffect(() => {
    if (userId) {
      initiateSocket(userId, userType);

      // Subscribe to messages
      subscribeToMessages((data) => {
        // Check if message is from current selected counselor
        if (
          selectedCounselor &&
          data.from === selectedCounselor.id.toString()
        ) {
          setChatLog((prev) => [
            ...prev,
            {
              from: data.from,
              fromType: data.fromType,
              message: data.message,
            },
          ]);
          // If not at bottom of chat, mark as unread
          if (!isAtBottom) {
            setUnreadMessages((prev) => ({
              ...prev,
              [data.from]: (prev[data.from] || 0) + 1,
            }));
          }
        } else {
          // Update unread count for non-selected counselors
          setUnreadMessages((prev) => ({
            ...prev,
            [data.from]: (prev[data.from] || 0) + 1,
          }));
        }

        // Update last message in counselors list
        setCounselors((prev) =>
          prev.map((counselor) =>
            counselor.id.toString() === data.from
              ? {
                  ...counselor,
                  lastMessage: data.message,
                  lastMessageTime: new Date(),
                }
              : counselor
          )
        );
      });

      // Load saved counselors from localStorage
      const savedCounselors = localStorage.getItem(
        `student_${userId}_counselors`
      );
      if (savedCounselors) {
        setCounselors(JSON.parse(savedCounselors));
      }

      // Load unread messages from localStorage
      const savedUnreadMessages = localStorage.getItem(
        `student_${userId}_unread_messages`
      );
      if (savedUnreadMessages) {
        setUnreadMessages(JSON.parse(savedUnreadMessages));
      }

      // Cleanup on unmount
      return () => {
        disconnectSocket();
      };
    }
  }, [userId]);

  // Save counselors to localStorage when they change
  useEffect(() => {
    if (userId && counselors.length > 0) {
      localStorage.setItem(
        `student_${userId}_counselors`,
        JSON.stringify(counselors)
      );
    }
  }, [counselors, userId]);

  // Save unread messages to localStorage
  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `student_${userId}_unread_messages`,
        JSON.stringify(unreadMessages)
      );
    }
  }, [unreadMessages, userId]);

  // Fetch chat history when selecting a counselor
  useEffect(() => {
    if (selectedCounselor) {
      fetchHistory(selectedCounselor.id);
      // Reset unread counter when selecting a counselor
      setUnreadMessages((prev) => ({
        ...prev,
        [selectedCounselor.id]: 0,
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
  }, [selectedCounselor]);

  // Handle scroll events for chat container
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatContainer;
      const bottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 20;
      setIsAtBottom(bottom);

      // If scrolled to bottom, clear unread messages for this counselor
      if (bottom && selectedCounselor) {
        setUnreadMessages((prev) => ({
          ...prev,
          [selectedCounselor.id]: 0,
        }));
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [selectedCounselor]);

  // Scroll to bottom when chat log updates
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatLog, isAtBottom]);

  // Show scroll to bottom button when new messages arrive and not at bottom
  useEffect(() => {
    if (selectedCounselor && chatLog.length > 0) {
      const lastMessage = chatLog[chatLog.length - 1];
      if (lastMessage.fromType === recipientType && !isAtBottom) {
        // Handle unread indicator logic here
      }
    }
  }, [chatLog, selectedCounselor, isAtBottom]);

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

  // Verify if counselor exists in database
  const verifyCounselor = async (counselorId) => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4040"
        }/api/counsellor/verify/${counselorId}`,
        { withCredentials: true }
      );

      return response.data.exits;
    } catch (error) {
      console.error("Error verifying counselor:", error);
      return false;
    }
  };

  // Fetch chat history
  const fetchHistory = async (counselorId) => {
    if (!userId || !counselorId) {
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
            studentId: userId,
            counselorId: counselorId,
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

  // Add a new counselor
  const addCounselor = async () => {
    if (!counselorId.trim()) return;

    // Check if counselor already exists in your list
    const exists = counselors.some((c) => c.id.toString() === counselorId);
    if (exists) {
      // Select the existing counselor instead of adding again
      const existingCounselor = counselors.find(
        (c) => c.id.toString() === counselorId
      );
      setSelectedCounselor(existingCounselor);
      setShowAddCounselor(false);
      setCounselorId("");
      return;
    }

    // Verify if counselor exists in database
    setLoading(true);
    const counselorExists = await verifyCounselor(counselorId);
    setLoading(false);

    if (!counselorExists) {
      setErrorMessage("Counselor ID not found. Please check and try again.");
      setShowError(true);
      return;
    }

    // If counselor exists, add to the list
    const newCounselor = {
      id: parseInt(counselorId),
      name: `Counselor ${counselorId}`, // Could be replaced with actual name if available
      lastMessage: "",
      lastMessageTime: new Date(),
    };

    setCounselors((prev) => [...prev, newCounselor]);
    setSelectedCounselor(newCounselor);
    setShowAddCounselor(false);
    setCounselorId("");
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });

      // Clear unread messages for this counselor
      if (selectedCounselor) {
        setUnreadMessages((prev) => ({
          ...prev,
          [selectedCounselor.id]: 0,
        }));
      }
    }
  };

  // Send a message
  const handleSend = () => {
    if (!message.trim() || !selectedCounselor || !userId) {
      return;
    }

    sendMessage(selectedCounselor.id.toString(), recipientType, message);

    // Add message to chat log
    setChatLog((prev) => [
      ...prev,
      {
        from: userId.toString(),
        fromType: userType,
        message,
        timestamp: new Date(),
      },
    ]);

    // Update last message in counselors list
    setCounselors((prev) =>
      prev.map((counselor) =>
        counselor.id === selectedCounselor.id
          ? {
              ...counselor,
              lastMessage: message,
              lastMessageTime: new Date(),
            }
          : counselor
      )
    );

    setMessage("");

    // Scroll to bottom after sending message
    setTimeout(scrollToBottom, 100);
  };

  // Handle Enter key in message input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (showAddCounselor) {
        addCounselor();
      } else {
        handleSend();
      }
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

  // Sort counselors by last message time
  const sortedCounselors = [...counselors].sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return timeB - timeA;
  });

  // Filter counselors based on search
  const filteredCounselors = sortedCounselors.filter((counselor) =>
    counselor.name.toLowerCase().includes(searchCounselor.toLowerCase())
  );

  return (
    <div className="flex h-full  bg-gray-100 overflow-hidden">
      {/* Left sidebar */}
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white flex flex-col transition-transform duration-300 ease-in-out absolute md:relative z-20 h-full`}
      >
        {/* Header */}
        <div className="p-3 bg-[#8200DB] text-white flex justify-between items-center">
          <h2 className="text-xl font-medium">Chats</h2>
          <button
            onClick={() => setShowAddCounselor(true)}
            className="bg-white bg-opacity-20  rounded-full w-9 h-9 flex items-center justify-center hover:bg-opacity-30 transition"
          >
            <Plus className="text-black" />
          </button>
        </div>

        {/* Search */}
        <div className="p-2 bg-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Search counselors..."
              className="w-full p-2 pl-10 rounded-lg border-none bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#8200DB]"
              value={searchCounselor}
              onChange={(e) => setSearchCounselor(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-500">
              <Search size={16} strokeWidth={1.25} absoluteStrokeWidth />
            </div>
          </div>
        </div>

        {/* Counselor list */}
        <div className="flex-1 overflow-y-auto">
          {filteredCounselors.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
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
                  className="text-[#8200DB]"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <p className="font-medium">No counselors found</p>
              <p className="text-sm mt-1">Click + to add a counselor</p>
            </div>
          ) : (
            filteredCounselors.map((counselor) => (
              <div
                key={counselor.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100 ${
                  selectedCounselor?.id === counselor.id ? "bg-purple-50" : ""
                }`}
                onClick={() => setSelectedCounselor(counselor)}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8200DB] flex items-center justify-center text-white shrink-0">
                    {counselor.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p
                        className={`font-medium truncate ${
                          unreadMessages[counselor.id]
                            ? "text-[#8200DB] font-semibold"
                            : ""
                        }`}
                      >
                        {counselor.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRelativeDate(counselor.lastMessageTime)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p
                        className={`text-sm truncate ${
                          unreadMessages[counselor.id]
                            ? "text-black font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {counselor.lastMessage || "No messages yet"}
                      </p>
                      <div className="flex items-center">
                        {unreadMessages[counselor.id] > 0 && (
                          <span className="bg-[#8200DB] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-1">
                            {unreadMessages[counselor.id]}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {counselor.lastMessageTime
                            ? formatMessageTime(counselor.lastMessageTime)
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
        {selectedCounselor ? (
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

                <div className="w-10 h-10 rounded-full bg-[#8200DB] flex items-center justify-center text-white">
                  {selectedCounselor.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{selectedCounselor.name}</p>
                  <p className="text-xs text-gray-500">
                    ID: {selectedCounselor.id}
                  </p>
                </div>
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
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#8200DB] border-t-transparent"></div>
                    <p className="text-gray-500 mt-4">Loading messages...</p>
                  </div>
                </div>
              ) : chatLog.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center bg-white p-6 rounded-lg shadow-sm max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#8200DB] bg-opacity-10 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8200DB"
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
                      Send a message to begin chatting with your counselor
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatLog.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        chat.fromType === userType
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[75%] shadow-sm ${
                          chat.fromType === userType
                            ? "bg-[#8200DB] text-white rounded-tr-none"
                            : "bg-white rounded-tl-none"
                        }`}
                      >
                        <p>{chat.message}</p>
                        <p
                          className={`text-xs ${
                            chat.fromType === userType
                              ? "text-gray-200"
                              : "text-gray-500"
                          } text-right mt-1`}
                        >
                          {formatMessageTime(chat.timestamp)}
                          {chat.fromType === userType && (
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
              {!isAtBottom && selectedCounselor && (
                <button
                  onClick={scrollToBottom}
                  className="fixed bottom-20 right-4 md:right-6 z-30 bg-[#8200DB] text-white rounded-full p-3 shadow-lg flex items-center justify-center hover:bg-purple-800 transition-all"
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
                  {unreadMessages[selectedCounselor.id] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessages[selectedCounselor.id]}
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
                  className="w-full rounded-full py-2 px-4 border-none focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              {message.trim() ? (
                <button
                  className="p-2 text-[#00a884] hover:text-[#008f6c]"
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
                    <path d="M12 2v6.5l3-3"></path>
                    <path d="M12 2v6.5l-3-3"></path>
                    <path d="M2 10h20"></path>
                    <path d="M12 17.5L9 20.5"></path>
                    <path d="M12 17.5l3 3"></path>
                    <path d="M18 22H6"></path>
                  </svg>
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-[#00a884] bg-opacity-10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00a884"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800">
                Start Counseling Chat
              </h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Select a counselor from the sidebar or add a new one to begin
                your conversation
              </p>
              {/* Mobile view - show sidebar button */}
              <button
                onClick={toggleSidebar}
                className="mt-6 bg-[#00a884] text-white px-5 py-2 rounded-full md:hidden flex items-center mx-auto"
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
                View Counselors
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add counselor modal */}
      {showAddCounselor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Counselor</h3>
              <button
                onClick={() => {
                  setShowAddCounselor(false);
                  setCounselorId("");
                }}
                className="text-gray-500 hover:text-gray-700"
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Counselor ID
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#00a884]"
                placeholder="Enter Counselor ID"
                value={counselorId}
                onChange={(e) => setCounselorId(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the unique ID of the counselor you want to chat with.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowAddCounselor(false);
                  setCounselorId("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#008f6c] transition"
                onClick={addCounselor}
                disabled={!counselorId.trim() || loading}
              >
                {loading ? "Checking..." : "Add Counselor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error popup */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-600">Error</h3>
            </div>
            <p className="text-gray-700">{errorMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => setShowError(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
