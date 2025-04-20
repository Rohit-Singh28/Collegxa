const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const cousellorRoute = require("./src/route/Counsellor");
const otpRoute = require("./src/route/otp");

const e = require("express");

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", otpRoute);
app.use("/api/counsellor", cousellorRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 4040;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
