const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const admin = await prisma.admin.findUnique({
    where: {
      email: email,
    },
  });

  console.log(admin);

  if (!admin) {
    return res.status(404).json({ error: "Admin not found" });
  }

  if (password !== admin.password) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = jwt.sign(
    {
      name: admin.name,
      email: admin.email,
      id: admin.id,
      role: "admin",
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "168h" }
  );

  // Set cookie options
  const tokenOption = {
    httpOnly: true,
    secure: true, // Only use secure in production
    sameSite: "strict", // Changed from "None" to "strict" for better compatibility
    maxAge: 7 * 24 * 60 * 60 * 1000, // 168 hours
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
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      message: "Login successful",
    });
};

module.exports = adminLogin;
