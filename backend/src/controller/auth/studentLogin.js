const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentLogin = async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Please provide email and password",
    });
  }

  try {
    // Find user by email
    const userDetail = await prisma.student.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
      },
    });

    // User not found
    if (!userDetail) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      userDetail.passwordHash
    );

    // Password doesn't match
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Incorrect password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        name: userDetail.name,
        email: userDetail.email,
        id: userDetail.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "96h" }
    );

    // Set cookie options
    const tokenOption = {
      httpOnly: true,
      secure: true, // Only use secure in production
      sameSite: "strict", // Changed from "None" to "strict" for better compatibility
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    };

    // Set cookie and send response
    return res
      .cookie("jwttoken", token, tokenOption)
      .status(200)
      .json({
        success: true,
        error: false,
        token: token,
        user: {
          id: userDetail.id,
          name: userDetail.name,
          email: userDetail.email,
        },
        message: "Login successful",
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Server error, please try again later",
    });
  }
};

module.exports = studentLogin;
