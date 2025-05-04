const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

// Import routes
const counsellorRoute = require("./src/route/Counsellor");
const otpRoute = require("./src/route/otp");
const authRoute = require("./src/route/auth");
const collegeRoute = require("./src/route/college");
const studentRoute = require("./src/route/student");
const chatRoute = require("./src/route/chat");

// Initialize Prisma client
const prisma = new PrismaClient();

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware setup
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

// Store socket connections
const userSocketMap = {};

// Socket.io connection handler

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const userType = socket.handshake.query.userType; // Add this to your client connection

  if (!userId || !userType) {
    console.warn("User connected without userId or userType");
    return;
  }

  // Store the user's socket along with their type
  userSocketMap[userId] = { socketId: socket.id, userType };
  console.log(
    `User ${userId} (${userType}) connected with socket ${socket.id}`
  );

  // Handle private messages
  socket.on("private-message", async ({ to, toType, message }) => {
    console.log(
      `Message from ${userId} (${userType}) to ${to} (${toType}): ${message}`
    );

    try {
      // Create chat record based on sender and receiver types
      const chatData = {
        message,
        senderType: userType,
        receiverType: toType,
      };

      // Set the appropriate sender ID field
      if (userType === "STUDENT") {
        chatData.studentSenderId = parseInt(userId);
      } else if (userType === "COUNSELLOR") {
        chatData.counsellorSenderId = parseInt(userId);
      }

      // Set the appropriate receiver ID field
      if (toType === "STUDENT") {
        chatData.studentReceiverId = parseInt(to);
      } else if (toType === "COUNSELLOR") {
        chatData.counsellorReceiverId = parseInt(to);
      }

      // Save the chat to DB
      await prisma.chat.create({
        data: chatData,
      });

      // Send message to receiver if online
      const receiverInfo = userSocketMap[to];
      if (receiverInfo) {
        io.to(receiverInfo.socketId).emit("private-message", {
          from: userId,
          fromType: userType,
          message,
        });
      }
    } catch (error) {
      console.error("Error saving or sending message:", error);
      console.error(error.stack);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${userId} (${userType}) disconnected`);
    delete userSocketMap[userId];
  });
});

// API routes
app.use("/api", otpRoute);
app.use("/api", authRoute);
app.use("/api/counsellor", counsellorRoute);
app.use("/api/college", collegeRoute);
app.use("/api/student", studentRoute);
app.use("/api/chats", chatRoute);

// Root route
app.use("/", (req, res) => {
  res.send("Chat Server is running!");
});

// Start server
const port = process.env.PORT || 4040;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
