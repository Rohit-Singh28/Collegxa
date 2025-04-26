const jwt = require("jsonwebtoken");
const wrapAsync = require("../utils/wrapasyn");

const AuthenticateUser = wrapAsync(async (req, res, next) => {
  const token = req.cookies?.jwttoken;
  const t = req.cookies;
  // console.log("Token", token);

  if (!token) {
    return res.status(200).json({
      message: "Login in to continue..",
      success: false,
      error: true,
      data: t,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token !");
  }
});

module.exports = { AuthenticateUser };
