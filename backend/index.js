const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser"); // Add this import

const cousellorRoute = require("./src/route/Counsellor");
const otpRoute = require("./src/route/otp");
const authRoute = require("./src/route/auth");
const collegeRoute = require("./src/route/college");
const studentRoute = require("./src/route/student");

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie parser middleware

// Configure CORS with proper options
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API routes
app.use("/api", otpRoute);
app.use("/api", authRoute);
app.use("/api/counsellor", cousellorRoute);
app.use("/api/college", collegeRoute);
app.use("/api/student", studentRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 4040;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
