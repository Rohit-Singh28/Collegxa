const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { email, name, phone, password } = req.body;
  if (!email || !name || !phone || !password) {
    return res
      .status(400)
      .json({ error: "Email, name and phone are required" });
  }

  try {
    // bcrypt password hashing
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new customError("some error occurs in password");
    }

    const user = await prisma.counsellor.create({
      data: {
        email,
        name,
        phone,
        password: hashPassword,
      },
    });

    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = register;
