// utils/socket.js

import { io } from "socket.io-client";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4040";

let socket;

export const initiateSocket = (userId, userType) => {
  if (!userId || !userType) {
    console.error("Cannot initialize socket without userId and userType");
    return;
  }

  // Close previous socket connection if exists
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection
  socket = io(SOCKET_SERVER_URL, {
    query: { userId, userType },
    withCredentials: true,
  });

  console.log(
    `Socket connecting with userId: ${userId}, userType: ${userType}`
  );

  socket.on("connect", () => {
    console.log("Socket connected successfully");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};

export const sendMessage = (to, toType, message) => {
  if (!socket) {
    console.error("Socket not initialized");
    return;
  }

  if (!to || !toType || !message) {
    console.error("Missing recipient, recipient type, or message");
    return;
  }

  socket.emit("private-message", { to, toType, message });
};

export const subscribeToMessages = (callback) => {
  if (!socket) {
    console.error("Socket not initialized");
    return;
  }

  socket.on("private-message", (data) => {
    callback(data);
  });
};
