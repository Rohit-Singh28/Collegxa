const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const verification = async (req, res) => {
  const { email, privateKey } = req.body;
  // console.log(email, privateKey);

  if (!email || !privateKey) {
    return res
      .status(400)
      .json({ msg: "Email and private key are required", data: [] });
  }

  try {
    const isUserExists = await prisma.registrationAccess.findUnique({
      where: {
        email,
      },
    });

    if (isUserExists) {
      return res.status(400).json({ msg: "User already exists", data: [] });
    }

    const existingKey = await prisma.registrationAccess.findUnique({
      where: {
        privateKey,
      },
    });

    if (existingKey) {
      return res.status(400).json({ msg: "Private key already used" });
    }

    const user = await prisma.registrationAccess.create({
      data: {
        email,
        privateKey,
      },
    });

    return res
      .status(201)
      .json({ msg: "User created successfully", data: user });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = verification;
