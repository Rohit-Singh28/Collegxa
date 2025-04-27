"use client";

import { useContext, useEffect, useState, useRef } from "react";
import {
  initiateSocket,
  sendMessage,
  subscribeToMessages,
  disconnectSocket,
} from "../../../utils/socket";
import axios from "axios";
import { studentContext } from "@/app/_context/studentContext";

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
  const chatContainerRef = useRef(null);
  const { student } = useContext(studentContext);
  const userId = student?.id;

  // Since this is a student component, we know the user type
  const userType = "STUDENT";
  const recipientType = "COUNSELLOR";

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
        }

        // Update last message in counselors list
        setCounselors((prev) =>
          prev.map((counselor) =>
            counselor.id.toString() === data.from
              ? { ...counselor, lastMessage: data.message }
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

  // Fetch chat history when selecting a counselor
  useEffect(() => {
    if (selectedCounselor) {
      fetchHistory(selectedCounselor.id);
    }
  }, [selectedCounselor]);

  // Scroll to bottom when chat log updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  // Verify if counselor exists in database
  const verifyCounselor = async (counselorId) => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4040"
        }/api/counsellor/verify/${counselorId}`,
        { withCredentials: true }
      );

      console.log("Counselor verification response:", response.data);

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
        }))
      );
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
    };

    setCounselors((prev) => [...prev, newCounselor]);
    setSelectedCounselor(newCounselor);
    setShowAddCounselor(false);
    setCounselorId("");
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
      },
    ]);

    // Update last message in counselors list
    setCounselors((prev) =>
      prev.map((counselor) =>
        counselor.id === selectedCounselor.id
          ? { ...counselor, lastMessage: message }
          : counselor
      )
    );

    setMessage("");
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
  const getTimeString = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  // Filter counselors based on search
  const filteredCounselors = counselors.filter((counselor) =>
    counselor.name.toLowerCase().includes(searchCounselor.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chats</h2>
            <button
              onClick={() => setShowAddCounselor(true)}
              className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search counselors..."
              className="w-full p-2 pl-8 rounded-lg border"
              value={searchCounselor}
              onChange={(e) => setSearchCounselor(e.target.value)}
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

        {/* Counselor list */}
        <div className="flex-1 overflow-y-auto">
          {filteredCounselors.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No counselors found. Click + to add a counselor.
            </div>
          ) : (
            filteredCounselors.map((counselor) => (
              <div
                key={counselor.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedCounselor?.id === counselor.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedCounselor(counselor)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {counselor.name.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold">{counselor.name}</p>
                      <p className="text-xs text-gray-500">{getTimeString()}</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {counselor.lastMessage || "No messages yet"}
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
        {selectedCounselor ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-gray-50 border-b flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {selectedCounselor.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{selectedCounselor.name}</p>
                <p className="text-xs text-gray-500">
                  ID: {selectedCounselor.id}
                </p>
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
                  <p className="text-gray-500">No messages yet. Say hello!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatLog.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg max-w-[70%] ${
                        chat.fromType === userType
                          ? "bg-green-100 ml-auto"
                          : "bg-white"
                      }`}
                    >
                      <p>{chat.message}</p>
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {chat.fromType === userType ? "You" : "Counselor"}
                        <span className="ml-2">{getTimeString()}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="p-4 bg-white border-t flex">
              <input
                className="flex-1 border rounded-l-lg p-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="bg-green-500 text-white p-2 rounded-r-lg"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600">
                Select a counselor to start chatting
              </h3>
              <p className="text-gray-500 mt-2">
                Or add a new counselor using the + button
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add counselor modal */}
      {showAddCounselor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Counselor</h3>
            <input
              className="w-full border p-2 mb-4"
              placeholder="Enter Counselor ID"
              value={counselorId}
              onChange={(e) => setCounselorId(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded text-gray-700"
                onClick={() => {
                  setShowAddCounselor(false);
                  setCounselorId("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={addCounselor}
                disabled={!counselorId.trim() || loading}
              >
                {loading ? "Checking..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error popup */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 border-t-4 border-red-500">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Error</h3>
            </div>
            <p className="mb-4 text-gray-700">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  setShowError(false);
                  setErrorMessage("");
                }}
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
